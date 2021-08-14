import { Kafka } from "kafkajs";
import { isDevelop } from "../utils/isDevelop";

const devConfig = {
  clientId: "my-app",
  brokers: process.env.BROKERS!.split(","),
};

const prodConfig = {
  clientId: "my-app",
  brokers: process.env.BROKERS!.split(","),
  ssl: isDevelop ? false : true,
  sasl: {
    mechanism: "scram-sha-256", // scram-sha-256 or scram-sha-512
    username: process.env.CLOUDKARAFKA_USERNAME!,
    password: process.env.CLOUDKARAFKA_PASSWORD!,
  },
};

export const kafka = new Kafka(isDevelop ? devConfig : prodConfig);
