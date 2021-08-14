import { db } from "../mongoDB";
import { Express } from "express";
import bcrypt from "bcrypt";
import HttpStatus from "../../helpers/httpStatus";
import { generateAccessToken, verifyRefreshToken } from "../../middleware/auth";
export const initAuth = (api: Express) => {
  api.post("/auth/signUpWithEmailAndPassword", async (req, res) => {
    const password = req.body.password;
    const email = req.body.email;

    if (password && email) {
      // Check if user exists
      const user = await db.collection("userSecrets").findOne({ email });
      if (user) {
        res.status(HttpStatus.Conflict).send("User already created");
      } else {
        // Not exists create user
        const hash = await bcrypt.hash(password, 10);
        await db.collection("userSecrets").insertOne({ email, hash });
        res.status(HttpStatus.Created).send();
      }
    } else {
      res
        .status(HttpStatus.BadRequest)
        .send("Please provide username and password");
    }
  });

  api.post("/auth/signInWithEmailAndPassword", async (req, res) => {
    const password = req.body.password;
    const email = req.body.email;

    if (password && email) {
      // Check if user exists
      const user = await db.collection("userSecrets").findOne({ email });
      if (!user) {
        res.status(HttpStatus.Conflict).send("User does not exist");
      } else {
        const result = await bcrypt.compare(password, user.hash);
        if (result) {
          const userId = user._id.toString();
          const accessToken = generateAccessToken({ email, userId });

          // Store refreshtoken
          const result = db.collection("refreshTokens").insertOne({
            userId,
            token: accessToken.refreshToken,
            createdAt: new Date(),
          });
          res.send(accessToken);
        } else {
          res.sendStatus(HttpStatus.Unauthorized);
        }
      }
    } else {
      res
        .status(HttpStatus.BadRequest)
        .send("Please provide username and password");
    }
  });

  api.post("/auth/signInWithEmail", async (req, res) => {
    try {
      const email = req.body.email;
      if (email) {
        const CODE = 123456;
        console.log(`Sending email with code ${CODE} to address ${email}`);
        await db.collection("emailcode").insertOne({
          code: CODE,
          email,
          expiresAt: new Date(new Date().getTime() + 1000 * 60 * 10),
        });
        return res.sendStatus(HttpStatus.Created);
      } else {
        res.sendStatus(HttpStatus.BadRequest);
      }
    } catch {
      return res.sendStatus(HttpStatus.InternalServerError);
    }
  });

  api.post("/auth/verifySignInWithCode", async (req, res) => {
    try {
      const email = req.body.email;
      const code = req.body.code;
      console.log(email, code);
      if (email && code) {
        const result = await db.collection("emailcode").findOne({
          expiresAt: { $gte: new Date() },
          email: { $eq: email },
          code: { $eq: req.body.code },
        });

        if (result) {
          const user = await db.collection("userSecrets").findOne({ email });
          const userId = user?._id.toString();
          const accessToken = generateAccessToken({ email, userId });

          // Store refreshtoken
          db.collection("refreshTokens").insertOne({
            userId,
            token: accessToken.refreshToken,
            createdAt: new Date(),
          });

          // Delete record
          await db.collection("emailcode").deleteOne({ _id: result._id });

          res.send(accessToken);
        }
        return res.sendStatus(HttpStatus.Unauthorized);
      } else {
        return res.sendStatus(HttpStatus.BadRequest);
      }
    } catch {
      return res.sendStatus(HttpStatus.InternalServerError);
    }
  });

  api.post("/auth/refresh", async (req, res) => {
    const token = req.body.token;
    if (token) {
      let user;
      try {
        user = verifyRefreshToken(token);
      } catch {
        return res.sendStatus(HttpStatus.Unauthorized);
      }
      if (user) {
        const userId = user.userId;
        const email = user.email;

        const exists = await db
          .collection("refreshTokens")
          .findOne({ userId, token });
        if (exists) {
          const accessToken = generateAccessToken({
            email,
            userId,
          });

          // Store refreshtoken
          await db.collection("refreshTokens").insertOne({
            userId,
            token: accessToken.refreshToken,
            createdAt: new Date(),
          });

          // Delete old refreshtoken
          await db.collection("refreshTokens").deleteOne({
            userId,
            token,
          });

          return res.send(generateAccessToken({ email }));
        } else {
          res.sendStatus(HttpStatus.Unauthorized);
        }
      } else {
        return res.sendStatus(HttpStatus.Unauthorized);
      }
    } else {
      return res
        .status(HttpStatus.BadRequest)
        .send("Missing required parameter 'token'");
    }
  });
};
