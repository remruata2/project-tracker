import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Expenditure from "@/models/Expenditure";
import { connect } from "http2";

// GET: Find one expenditure by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDatabase();
    const expenditure = await Expenditure.findById(params.id);
    if (!expenditure) {
      return NextResponse.json(
        { error: "Expenditure not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(expenditure);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch expenditure" },
      { status: 500 },
    );
  }
}

// DELETE: Delete one expenditure by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDatabase();
    const deletedExpenditure = await Expenditure.findByIdAndDelete(params.id);
    if (!deletedExpenditure) {
      return NextResponse.json(
        { error: "Expenditure not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: "Expenditure deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete expenditure" },
      { status: 500 },
    );
  }
}

// PUT: Update one expenditure by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const updatedExpenditure = await Expenditure.findByIdAndUpdate(
      params.id,
      body,
      { new: true },
    );
    if (!updatedExpenditure) {
      return NextResponse.json(
        { error: "Expenditure not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedExpenditure);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update expenditure" },
      { status: 500 },
    );
  }
}
