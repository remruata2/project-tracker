"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import mongoose from "mongoose";

interface Project {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  projectId: Project;
  subcategories?: Subcategory[];
}

interface Subcategory {
  _id: string;
  name: string;
  amount: number;
  parentCategoryId: string;
}

export default function ManageCategories() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form states
  const [categoryName, setCategoryName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryAmount, setSubcategoryAmount] = useState<number | null>(
    null
  );
  const [parentCategoryId, setParentCategoryId] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories. Please try again.");
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    if (!categoryName.trim() || !projectId) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: categoryName.trim(),
          projectId: projectId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Category added:", data);
      setSuccess(true);
      setCategoryName("");
      setProjectId("");
      fetchCategories(); // Refresh categories list
      setShowCategoryModal(false);
    } catch (error) {
      console.error("Error submitting category:", error);
      setError("Failed to add category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubcategorySubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    if (!subcategoryName.trim() || !parentCategoryId) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/subCategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: subcategoryName.trim(),
          amount: subcategoryAmount,
          parentCategoryId: parentCategoryId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Subcategory added:", data);
      setSuccess(true);
      setSubcategoryName("");
      setSubcategoryAmount(null);
      setParentCategoryId("");
      fetchCategories(); // Refresh categories list
      setShowSubcategoryModal(false);
    } catch (error) {
      console.error("Error submitting subcategory:", error);
      setError("Failed to add subcategory. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = async (category: Category) => {
    const newName = prompt("Enter new name for category:", category.name);
    if (newName && newName !== category.name) {
      try {
        const response = await fetch(`/api/categories/${category._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setSuccess(true);
        fetchCategories(); // Refresh the categories list
      } catch (error) {
        console.error("Error updating category:", error);
        setError("Failed to update category. Please try again.");
      }
    }
  };

  const handleSubcategoryAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSubcategoryAmount(value === "" ? null : parseFloat(value));
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setSuccess(true);
        fetchCategories(); // Refresh the categories list
      } catch (error) {
        console.error("Error deleting category:", error);
        setError("Failed to delete category. Please try again.");
      }
    }
  };
  const handleEditSubcategory = async (subcategory: Subcategory) => {
    const newName = prompt("Enter new name for subcategory:", subcategory.name);
    const newAmountStr = prompt(
      "Enter new amount for subcategory:",
      subcategory.amount.toString()
    );
    const newAmount = newAmountStr ? parseFloat(newAmountStr) : null;

    if (
      (newName && newName !== subcategory.name) ||
      (newAmount !== null && newAmount !== subcategory.amount)
    ) {
      try {
        const response = await fetch(`/api/subCategories/${subcategory._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newName || subcategory.name,
            amount: newAmount !== null ? newAmount : subcategory.amount,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setSuccess(true);
        fetchCategories(); // Refresh the categories list
      } catch (error) {
        console.error("Error updating subcategory:", error);
        setError("Failed to update subcategory. Please try again.");
      }
    }
  };

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        const response = await fetch(`/api/subCategories/${subcategoryId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setSuccess(true);
        fetchCategories(); // Refresh the categories list
      } catch (error) {
        console.error("Error deleting subcategory:", error);
        setError("Failed to delete subcategory. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Manage Categories</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && (
        <div className="alert alert-success">Operation successful!</div>
      )}

      <div className="mb-4">
        <Button
          variant="primary"
          className="me-2"
          onClick={() => setShowCategoryModal(true)}
        >
          Add Category
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowSubcategoryModal(true)}
        >
          Add Subcategory
        </Button>
      </div>

      <Modal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCategorySubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Project:</Form.Label>
              <Form.Select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category Name:</Form.Label>
              <Form.Control
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Category"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showSubcategoryModal}
        onHide={() => setShowSubcategoryModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Subcategory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubcategorySubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Parent Category:</Form.Label>
              <Form.Select
                value={parentCategoryId}
                onChange={(e) => setParentCategoryId(e.target.value)}
                required
              >
                <option value="">Select a parent category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subcategory Name:</Form.Label>
              <Form.Control
                type="text"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={subcategoryAmount === null ? "" : subcategoryAmount}
                onChange={handleSubcategoryAmountChange}
                required
              />
            </Form.Group>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Subcategory"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <div className="list-group">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Sub Categories</th>
              <th>Project Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>
                  {category.subcategories &&
                  category.subcategories.length > 0 ? (
                    <table className="table table-sm">
                      <tbody>
                        {category.subcategories.map((subcategory) => (
                          <tr key={subcategory._id}>
                            <td>{subcategory.name}</td>
                            <td>{subcategory.amount}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() =>
                                  handleEditSubcategory(subcategory)
                                }
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleDeleteSubcategory(subcategory._id)
                                }
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    "No subcategories"
                  )}
                </td>
                <td>{category.projectId ? category.projectId.name : "N/A"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEditCategory(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
