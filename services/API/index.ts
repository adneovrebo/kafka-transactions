import express from "express";
import swaggerUi from "swagger-ui-express";
import { initAuth } from "./auth";
import { initTransaction } from "./transaction";

const swaggerDocument = require("./swagger.json");
const api = express();
const API_PORT = 3000;

api.use(express.json());
api.use(express.urlencoded());
api.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

api.get("/", async (req, res) => {
  res.sendStatus(200);
});

export const runAPI = () => {
  initTransaction(api);
  initAuth(api);
  api.listen(API_PORT, () =>
    console.log(`API listening at http://localhost:${API_PORT}`)
  );
};
