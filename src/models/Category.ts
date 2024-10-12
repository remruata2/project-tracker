import { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  projectId: Schema.Types.ObjectId;
  subcategories: Schema.Types.ObjectId[];
}
