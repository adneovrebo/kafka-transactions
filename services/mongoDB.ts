import { MongoClient } from "mongodb";
const uri = process.env.MONGO_DB_CONNECTION_STRING!;
const client = new MongoClient(uri, {
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const initDB = async () => {
  await client.connect();
};

export const db = client.db("myfirstdb");
