// pages/api/budgets.js
import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === "POST") {
    const { project_id, category_id, sub_category_id, amount } = req.body;
    const budget = await db.collection("budgets").insertOne({
      project_id,
      category_id,
      sub_category_id,
      amount,
    });
    return res.json(budget.ops[0]);
  } else if (req.method === "GET") {
    const budgets = await db.collection("budgets").find().toArray();
    return res.json(budgets);
  }
}
