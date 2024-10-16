import mongoose from 'mongoose';
import { ICategory } from './Category';
import { ISubcategory } from './Subcategory';
import { IProject } from './Project'; // Assuming you have a Project model

const ProjectSchema = new mongoose.Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for this project.'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    // Add other fields as needed
  },
  { timestamps: true }
);

// Category Model
const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    subcategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
    ],
  },
  { timestamps: true }
);

// Subcategory Model
const subcategorySchema = new mongoose.Schema<ISubcategory>(
  {
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true }
);

// Project Model (assuming you have one)

const expenditureSchema = new mongoose.Schema({
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true,
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  note: { type: String },
});

export const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>('Category', categorySchema);
export const Subcategory =
  mongoose.models.Subcategory ||
  mongoose.model<ISubcategory>('Subcategory', subcategorySchema);
export const Project =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

// Export a function to initialize models
export function initModels() {
  // This function doesn't need to do anything,
  // just importing it will ensure all models are registered
}
