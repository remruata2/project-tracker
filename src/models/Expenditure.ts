import mongoose, { Schema, Document } from 'mongoose';

export interface IExpenditure extends Document {
  projectId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  subCategoryId: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
  description: string; // Added this field for more context
  createdAt: Date;
  updatedAt: Date;
}

const ExpenditureSchema: Schema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.Expenditure ||
  mongoose.model<IExpenditure>('Expenditure', ExpenditureSchema);
