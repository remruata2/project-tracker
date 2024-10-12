"use client";

import { useState } from "react";

export default function SubmitCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: categoryName,
          description: categoryDescription,
        }),
      });
      const data = await response.json();
      console.log(data);
      setCategoryName("");
      setCategoryDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Submit Category</h1>
      <form onSubmit={handleSubmit} className="needs-validation">
        <div className="mb-3">
          <label htmlFor="categoryName" className="form-label">
            Category Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
          <div className="invalid-feedback">Please enter a category name.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="categoryDescription" className="form-label">
            Category Description:
          </label>
          <textarea
            className="form-control"
            id="categoryDescription"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            required
          />
          <div className="invalid-feedback">
            Please enter a category description.
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Category
        </button>
      </form>
    </div>
  );
}
