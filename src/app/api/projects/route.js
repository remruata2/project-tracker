import { NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const projects = await db.collection("projects").find().toArray();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Invalid project name" },
        { status: 400 }
      );
    }

    const result = await db
      .collection("projects")
      .insertOne({ name: name.trim() });
    const insertedProject = await db
      .collection("projects")
      .findOne({ _id: result.insertedId });

    return NextResponse.json(insertedProject, { status: 201 });
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
