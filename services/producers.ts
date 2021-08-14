import { kafka } from "./kafka";
import { Topics } from "./types";

const producer = kafka.producer();

export const initProducer = async () => {
  await producer.connect();
};

export const produceTransaction = async (amount: number, user: string) => {
  await producer.send({
    topic: Topics.Transaction,
    messages: [
      {
        value: JSON.stringify({
          date: new Date(),
          value: amount,
          username: user,
        }),
      },
    ],
  });
};
