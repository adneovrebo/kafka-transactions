import express from "express";
import { db } from "./mongoDB";
import { produceTransaction } from "./producers";

const api = express();
const API_PORT = 3000;

api.get("/", async (req, res) => {
  const amount = req.query.amount;
  const user = req.query.user?.toString();
  if (Number(amount) && user) {
    await produceTransaction(Number(amount), user);
    console.log("Transaction created!");
    res.send("Transaction created!");
  } else {
    res.status(400).send("Missing amount or user in query");
  }
});

api.get("/transaction", async (req, res) => {
  const user = req.query.user?.toString();
  if (user) {
    const result = await db
      .collection("transaction")
      .findOne({ username: user });
    res.send(result);
  } else {
    res.status(400).send("Missing required parameter 'user'");
  }
});

api.get("/transaction/versions", async (req, res) => {
  const user = req.query.user?.toString();
  if (user) {
    const existing = await db
      .collection("transaction")
      .findOne({ username: user });
    if (existing) {
      const result = await db
        .collection("transaction-version")
        .find({ id: existing._id })
        .toArray();
      result.forEach((e) => delete e.id);
      const cleaned = result
        .map((e) => ({ ...e, newest: false }))
        .sort((a: any, b: any) => +b.replacedAt - +a.replacedAt);
      res.send([{ ...existing, newest: true }, ...cleaned]);
    } else {
      res.send([existing]);
    }
  } else {
    res.status(400).send("Missing required parameter 'user'");
  }
});

api.get("/transaction/events", async (req, res) => {
  const user = req.query.user?.toString();
  if (user) {
    const result = await db
      .collection("event")
      .find({ key: user, name: "transaction" })
      .toArray();
    res.send(result);
  } else {
    res.status(400).send("Missing required parameter 'user'");
  }
});

export const runAPI = () => {
  api.listen(API_PORT, () =>
    console.log(`API listening at http://localhost:${API_PORT}`)
  );
};
