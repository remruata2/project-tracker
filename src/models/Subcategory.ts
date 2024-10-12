import { Document, Schema } from "mongoose";

export interface ISubcategory extends Document {
  name: string;
  amount: number;
  category: Schema.Types.ObjectId;
}
