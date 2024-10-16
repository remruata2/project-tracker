import { NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongodb";
import { Category, Subcategory, initModels } from "../../../models/index";
import { exit } from "process";
initModels();
export async function GET() {
  try {
    await connectToDatabase();

    const subcategories = await Subcategory.find().lean();

    return NextResponse.json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const { name, amount, parentCategoryId } = await request.json();

    if (!name || !parentCategoryId || !amount) {
      return NextResponse.json(
        { error: "Name, Parent ID and amount are required" },
        { status: 400 },
      );
    }

    if (typeof amount !== "number" || isNaN(amount)) {
      return NextResponse.json(
        { error: "Amount must be a valid number" },
        { status: 400 },
      );
    }

    // Validate that the parent category exists
    const parentCategory = await Category.findById(parentCategoryId);
    if (!parentCategory) {
      return NextResponse.json(
        { error: "Parent category not found" },
        { status: 404 },
      );
    }
    console.log(typeof amount);
    // Create new subcategory
    console.log("Data received:", { name, amount, parentCategoryId });

    const newSubcategory = new Subcategory({
      name,
      amount,
      category: parentCategoryId,
    });

    const validationError = newSubcategory.validateSync();
    if (validationError) {
      console.error("Validation error:", validationError);
      return NextResponse.json(
        { error: "Validation failed", details: validationError.errors },
        { status: 400 },
      );
    }

    // Save the new subcategory
    console.log("Before save:", newSubcategory.toObject());
    await newSubcategory.save();
    console.log("After save:", newSubcategory.toObject());

    // Update the parent category with the new subcategory
    await Category.findByIdAndUpdate(parentCategoryId, {
      $push: { subcategories: newSubcategory._id },
    });

    return NextResponse.json(newSubcategory.toObject(), { status: 201 });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
