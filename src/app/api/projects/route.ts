import { NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongodb";
import { Project, initModels } from "../../../models/index";

initModels();
export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find({});
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextResponse) {
  try {
    await connectToDatabase();
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Invalid project name" },
        { status: 400 }
      );
    }

    const project = await Project.create({ name: name.trim() });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Failed to add project:", error);
    return NextResponse.json(
      { error: "Failed to add project" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextResponse) {
  try {
    await connectToDatabase();
    const { id, name } = await request.json();

    if (!id || !name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Invalid project data" },
        { status: 400 }
      );
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextResponse) {
  {
    try {
      await connectToDatabase();
      const { id } = await request.json();

      if (!id) {
        return NextResponse.json(
          { error: "Project ID is required" },
          { status: 400 }
        );
      }

      const deletedProject = await Project.findByIdAndDelete(id);

      if (!deletedProject) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Failed to delete project:", error);
      return NextResponse.json(
        { error: "Failed to delete project" },
        { status: 500 }
      );
    }
  }
}
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
