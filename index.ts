import dotenv from "dotenv";
import { isDevelop } from "./utils/isDevelop";

dotenv.config({
  path: isDevelop ? ".env.development" : ".env",
});

import { runAPI } from "./services/API";
import { runConsumers } from "./services/consumers";
import { initDB } from "./services/mongoDB";
import { initProducer } from "./services/producers";
import "./models/index";

const init = async () => {
  await initDB();
  await initProducer();
  runAPI();
  runConsumers(); // We can replicate the instance and not get duplicated events, Amazing!
  runConsumers(); // We can replicate the instance and not get duplicated events, Amazing!
};
init();
