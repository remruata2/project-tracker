import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import mongoose from "mongoose";

interface Subcategory {
  name: string;
  amount: number;
}

interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
  projectId: mongoose.Schema.Types.ObjectId;
}

interface BudgetTableProps {
  projectId: string;
}

const BudgetTable: React.FC<BudgetTableProps> = ({ projectId }) => {
  const [projectName, setProjectName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  console.log(projectId);
  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/categories?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProjectName(data.name);
      } else {
        throw new Error("Failed to fetch project");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  console.log(categories);

  useEffect(() => {
    fetchProject();
    fetchCategories();
  }, [projectId]);

  const calculateTotalBudget = () => {
    return categories.reduce((total, category) => {
      return (
        total +
        category.subcategories.reduce(
          (subTotal, sub) => subTotal + sub.amount,
          0
        )
      );
    }, 0);
  };

  return (
    <div className="project-details">
      <h2>{projectName}</h2>
      <Table responsive striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <React.Fragment key={index}>
              {category.subcategories.map((sub, subIndex) => (
                <tr key={`${index}-${subIndex}`}>
                  {subIndex === 0 && (
                    <td rowSpan={category.subcategories.length}>
                      {category.name}
                    </td>
                  )}
                  <td>{sub.name}</td>
                  <td>Rs. {sub.amount.toFixed(2)}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          <tr>
            <td colSpan={2}>
              <strong>Total Budget</strong>
            </td>
            <td>
              <strong>Rs. {calculateTotalBudget().toFixed(2)}</strong>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default BudgetTable;
