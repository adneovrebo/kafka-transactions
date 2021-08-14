import { Schema, model } from "mongoose";

interface Event {
  username: String;
  eventname: String;
  payload: Object;
  createdAt: Date;
}

const schema = new Schema<Event>({
  username: { type: String, required: true },
  eventname: { type: String, required: true },
  payload: { type: Object, required: true },
  createdAt: { type: Date, required: true },
});

export const Event = model<Event>("Event", schema);
