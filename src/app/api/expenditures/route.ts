import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongodb";
import Expenditure from "../../../models/Expenditure";

export async function GET(request: NextRequest) {
  await connectToDatabase();
  try {
    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");
    const all = url.searchParams.get("all") === "true";
    const page = all ? 1 : parseInt(url.searchParams.get("page") || "1");
    const limit = all ? 0 : parseInt(url.searchParams.get("limit") || "9");
    const skip = all ? 0 : (page - 1) * limit;

    const filter = projectId ? { projectId } : {};

    const totalExpenditures = await Expenditure.countDocuments(filter);
    const totalPages = all ? 1 : Math.ceil(totalExpenditures / limit);

    let query = Expenditure.find(filter)
      .populate({
        path: "projectId",
        model: "Project",
        select: "name",
      })
      .populate({
        path: "categoryId",
        model: "Category",
        select: "name",
      })
      .populate({
        path: "subCategoryId",
        model: "Subcategory",
        select: "name",
      })
      .sort({ date: -1 });

    if (!all) {
      query = query.skip(skip).limit(limit);
    }

    const expenditures = await query;

    return NextResponse.json({
      expenditures,
      currentPage: page,
      totalPages,
      totalExpenditures,
    });
  } catch (error: any) {
    console.error("Error in GET /api/expenditures:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

export async function POST(request: NextRequest) {
  await connectToDatabase();
  try {
    const body = await request.json();
    const expenditure = await Expenditure.create(body);
    return NextResponse.json(
      { success: true, data: expenditure },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
