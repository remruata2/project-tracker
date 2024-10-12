import { Document, Schema } from "mongoose";

export interface IProject extends Document {
  name: string;
  categories: Schema.Types.ObjectId[]; // Array of category IDs
  createdAt: Date;
  updatedAt: Date;
}
