import dotenv from "dotenv";
dotenv.config();

import { runAPI } from "./services/API";
import { runConsumers } from "./services/consumers";
import { initDB } from "./services/mongoDB";
import { initProducer } from "./services/producers";

const init = async () => {
  await initDB();
  await initProducer();
  runAPI();
  runConsumers(); // We can replicate the instance and not get duplicated events, Amazing!
  runConsumers(); // We can replicate the instance and not get duplicated events, Amazing!
};
init();
