import { incrementTransaction } from "../models/userBalance";
import { kafka } from "./kafka";
import { Groups, Topics } from "./types";
import { Event } from "../models/event";

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
      await incrementTransaction(payload.username, payload.value);
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
      await new Event({
        eventname: topic.toString().replace("95rexcgt-", ""),
        username: payload.username,
        payload: payload,
        createdAt: new Date(+message.timestamp),
      }).save();
      console.log("Event consumed!");
    },
  });
};

export const runConsumers = () => {
  runTransactionConsumer();
  runEventConsumer();
};
