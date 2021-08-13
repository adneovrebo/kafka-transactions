import { ObjectId } from "mongodb";
import { kafka } from "./kafka";
import { db } from "./mongoDB";
import { Groups, Topics } from "./types";

const runTransactionConsumer = async () => {
  const consumer = kafka.consumer({
    groupId: Groups.TransactionBalanceConsumer,
  });
  await consumer.connect();
  await consumer.subscribe({
    topic: Topics.Transaction,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value?.toString()!);
      const key = message.key.toString();

      const existing = await db
        .collection("transaction")
        .findOne({ username: key });
      if (existing) {
        await db.collection("transaction-version").insertOne({
          ...existing,
          replacedAt: new Date(),
          id: existing._id,
          _id: new ObjectId(),
        });
      }

      await db.collection("transaction").updateOne(
        { username: key },
        {
          $inc: { amount: payload.value },
        },
        { upsert: true }
      );
      console.log("Consumed transaction!");
    },
  });
};

const runEventConsumer = async () => {
  const consumer = kafka.consumer({
    groupId: Groups.AllEventsConsumer,
  });
  await consumer.connect();

  for (const topic of Object.values(Topics)) {
    await consumer.subscribe({
      topic: topic,
      fromBeginning: true,
    });
  }

  await consumer.run({
    eachMessage: async ({ message, topic }) => {
      const payload = JSON.parse(message.value?.toString()!);
      const key = message.key.toString();
      await db.collection("event").insertOne({
        key: key,
        payload: payload,
        createdAt: new Date(message.timestamp),
        name: topic.toString().replace("95rexcgt-", ""),
      });
      console.log("Event consumed!");
    },
  });
};

export const runConsumers = () => {
  runTransactionConsumer();
  runEventConsumer();
};
