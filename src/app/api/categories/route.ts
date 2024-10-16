import { connectToDatabase } from "../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Category, Subcategory, initModels } from "../../../models";

import mongoose from "mongoose";

initModels();

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find()
      .populate({
        path: "subcategories",
        model: Subcategory,
      })
      .populate({
        path: "projectId",
        model: "Project",
        select: "name", // You can specify which fields you want from the Project model
      })
      .lean();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error in GET /api/categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    console.log("Received body:", body);

    if (
      !body ||
      typeof body !== "object" ||
      !body.name ||
      typeof body.name !== "string" ||
      body.name.trim() === "" ||
      !body.projectId ||
      typeof body.projectId !== "string" ||
      !mongoose.Types.ObjectId.isValid(body.projectId)
    ) {
      return NextResponse.json(
        { error: "Invalid or missing name or projectId" },
        { status: 400 },
      );
    }

    // Validate if the project exists
    const Project = mongoose.models.Project || mongoose.model("Project");
    const project = await Project.findById(body.projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const category = new Category({
      name: body.name.trim(),
      projectId: body.projectId,
    });

    await category.save();

    return NextResponse.json(category.toObject(), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Add PUT and DELETE methods here
