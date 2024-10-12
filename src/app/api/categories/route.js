// pages/api/categories.js
import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === "POST") {
    const { name } = req.body;
    const category = await db.collection("categories").insertOne({ name });
    return res.json(category.ops[0]);
  } else if (req.method === "GET") {
    const categories = await db.collection("categories").find().toArray();
    return res.json(categories);
  }
}
