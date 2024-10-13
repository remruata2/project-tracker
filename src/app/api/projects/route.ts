import { NextResponse, NextRequest } from "next/server";
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

export async function POST(request: NextRequest) {
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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
