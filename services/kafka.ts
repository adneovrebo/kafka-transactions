import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "my-app",
  brokers: process.env.BROKERS!.split(","),
  ssl: true,
  sasl: {
    mechanism: "scram-sha-256", // scram-sha-256 or scram-sha-512
    username: process.env.CLOUDKARAFKA_USERNAME!,
    password: process.env.CLOUDKARAFKA_PASSWORD!,
  },
});
