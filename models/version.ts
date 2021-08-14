import { Types } from "mongoose";

export interface Version {
  id: string;
  createdAt: Date;
}

export const versionFields = {
  id: { type: Types.ObjectId, required: true },
  createdAt: Date,
};
