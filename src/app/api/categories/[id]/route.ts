import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/app/lib/mongodb";

import { Category, Subcategory, initModels } from "@/models/index";

initModels();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const id = params.id;

    if (
      !id ||
      !body.name ||
      typeof body.name !== "string" ||
      body.name.trim() === ""
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: { name: body.name.trim() } },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error in PUT /api/categories/[id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing category id" },
        { status: 400 }
      );
    }

    // Find the category and its subcategories
    const category = await Category.findById(id).populate("subcategories");

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Delete all subcategories
    await Subcategory.deleteMany({ _id: { $in: category.subcategories } });

    // Delete the category
    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Category and its subcategories deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/categories/[id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
