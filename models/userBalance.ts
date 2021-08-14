import { ObjectId } from "mongodb";
import { Schema, model, connect } from "mongoose";
import { Version, versionFields } from "./version";

// Create an interface
interface UserBalance {
  username: string;
  amount: number;
}

type UserBalanceVersion = UserBalance & Version;

// Create a schemas
const schema = new Schema<UserBalance>({
  username: { type: String, required: true },
  amount: { type: Number, required: true },
});

const versionSchema = new Schema<UserBalanceVersion>({
  username: { type: String, required: true },
  amount: { type: Number, required: true },
  ...versionFields,
});

// Create models
export const UserBalance = model<UserBalance>("UserBalance", schema);
export const UserBalanceVersion = model<UserBalanceVersion>(
  "UserBalanceVersion",
  versionSchema
);

// --------------------------------------
// ---------- HELPER FUNCTIONS ----------
// --------------------------------------

export const incrementTransaction = async (key: string, value: number) => {
  const session = await UserBalance.startSession();
  try {
    const opts = { session };

    session.startTransaction();
    const doc = await UserBalance.findOneAndUpdate(
      { username: key },
      {
        $inc: { amount: value, __v: 1 },
      },
      { ...opts, returnDocument: "after", upsert: true }
    );

    await new UserBalanceVersion({
      ...doc?.toObject(),
      createdAt: new Date(),
      id: doc?._id,
      _id: new ObjectId(),
    }).save(opts);

    await session.commitTransaction();
    session.endSession();
    console.log("Consumed transaction!");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(err);
  }
};
