"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [budgetName, setBudgetName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [amount, setAmount] = useState(0);

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [budgets, setBudgets] = useState([]);

  const fetchProjects = async () => {
    const response = await fetch("/api/projects");
    const data = await response.json();
    setProjects(data);
  };

  const fetchCategories = async () => {
    const response = await fetch("/api/categories");
    const data = await response.json();
    setCategories(data);
  };

  const fetchSubCategories = async () => {
    const response = await fetch("/api/subcategories");
    const data = await response.json();
    setSubCategories(data);
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
    fetchSubCategories();
  }, []);

  const createBudget = async () => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          category_id: categoryId,
          sub_category_id: subCategoryId,
          amount: amount,
        }),
      });
      const data = await response.json();
      setBudgets([...budgets, data]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProjectChange = (e) => {
    setProjectId(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
  };

  const handleSubCategoryChange = (e) => {
    setSubCategoryId(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  return (
    <div>
      <h1>Create Budget</h1>
      <form>
        <label>
          Project:
          <select value={projectId} onChange={handleProjectChange}>
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Category:
          <select value={categoryId} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sub Category:
          <select value={subCategoryId} onChange={handleSubCategoryChange}>
            <option value="">Select Sub Category</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory._id} value={subCategory._id}>
                {subCategory.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Amount:
          <input type="number" value={amount} onChange={handleAmountChange} />
        </label>
        <button type="button" onClick={createBudget}>
          Create Budget
        </button>
      </form>
      <h2>Budgets List</h2>
      <ul>
        {budgets.map((budget) => (
          <li key={budget._id}>
            Project: {budget.project_id} | Category: {budget.category_id} | Sub
            Category: {budget.sub_category_id} | Amount: {budget.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
