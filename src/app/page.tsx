/* eslint-disable prettier/prettier */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "@/app/page.module.css";
import { Form, Tab, Tabs, Row, Col, Button } from "react-bootstrap";
import BudgetPieChart from "@/components/BudgetChart";
import BudgetTable from "@/components/BudgetTable";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BudgetDashboard from "@/components/BudgetDashboard";
import ExpenditureDashboard from "@/components/ExpenditureDashboard";
import BudgetVsExpenditureChart from "@/components/BudgetVsExpenditure";
import "@/app/custom-tabs.css";

export interface Project {
  _id: string;
  name: string;
}

export interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
  projectId: Project;
}

export interface Subcategory {
  _id: string;
  name: string;
  amount: number;
}

export interface Expenditure {
  _id: string;
  projectId: {
    _id: string;
    name: string;
  };
  categoryId: {
    _id: string;
    name: string;
  };
  subCategoryId: {
    _id: string;
    name: string;
  };
  amount: number;
  date: string;
  description: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const MemoizedBudgetDashboard = React.memo(BudgetDashboard);
  const MemoizedBudgetPieChart = React.memo(BudgetPieChart);
  const MemoizedExpenditureDashboard = React.memo(ExpenditureDashboard);
  const MemoizedBudgetVsExpenditureChart = React.memo(BudgetVsExpenditureChart);
  const MemoizedBudgetTable = React.memo(BudgetTable);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        throw new Error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchExpenditures = async (projectId: string) => {
    try {
      const response = await fetch(
        `/api/expenditures?all=true&projectId=${projectId}`,
      );
      if (response.ok) {
        const data = await response.json();
        setExpenditures(data.expenditures); // Assuming the API returns an object with an 'expenditures' array
      } else {
        throw new Error("Failed to fetch expenditures");
      }
    } catch (error) {
      console.error("Error fetching expenditures:", error);
      setExpenditures([]); // Set to empty array in case of error
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
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

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (projectId) {
      setSelectedProject(projectId);
      fetchExpenditures(projectId);
    }
  }, [projectId]);

  const handleProjectSelect = useCallback((projectId: string) => {
    setSelectedProject(projectId);
    fetchExpenditures(projectId);
  }, []);

  const prepareChartData = useCallback(() => {
    if (!selectedProject) {
      console.log("No project selected");
      return [];
    }

    const categoryMap = new Map();

    // First, find all categories associated with the selected project and calculate their budgets
    categories.forEach((category) => {
      if (category.projectId._id === selectedProject) {
        const categoryBudget = category.subcategories.reduce(
          (total, sub) => total + sub.amount,
          0,
        );
        categoryMap.set(category._id, {
          name: category.name, // Store the name for later use
          budget: categoryBudget,
          expenditure: 0,
        });
      }
    });

    // Then, calculate expenditure for each category
    expenditures.forEach((item) => {
      if (categoryMap.has(item.categoryId._id)) {
        categoryMap.get(item.categoryId._id).expenditure += item.amount;
      } else {
        console.log("Category not found:", item.categoryId.name);
      }
    });

    const chartData = Array.from(categoryMap, ([id, values]) => ({
      name: values.name,
      budget: values.budget,
      expenditure: values.expenditure,
    }));

    return chartData;
  }, [selectedProject, categories, expenditures]);

  useEffect(() => {
    if (selectedProject) {
      const chartData = prepareChartData();
    }
  }, [selectedProject, prepareChartData]);

  return (
    <div className={styles.container}>
      <h1>Project Budget Tracker</h1>
      <div className="mb-4">
        <Row>
          <Col>
            <Form.Select
              aria-label="Select Project"
              value={selectedProject}
              onChange={(e) => handleProjectSelect(e.target.value)}
              className="float-start"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Link href="/project-list">
              <Button variant="secondary" className="float-end">
                Manage Projects
              </Button>
            </Link>
          </Col>
        </Row>
      </div>

      {selectedProject && (
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k || "dashboard")}
          className="mb-3 custom-tabs"
        >
          <Tab eventKey="dashboard" title="Dashboard">
            <MemoizedBudgetDashboard
              projectId={selectedProject}
              categories={categories}
            />
          </Tab>
          <Tab eventKey="table" title="Budget Table">
            <MemoizedBudgetTable
              projectId={selectedProject}
              categories={categories}
              projectName={
                projects.find((p) => p._id === selectedProject)?.name ||
                "Unknown Project"
              }
            />
          </Tab>
          <Tab eventKey="piechart" title="Budget Pie Chart">
            <MemoizedBudgetPieChart categories={categories} />
          </Tab>
          <Tab eventKey="expenditure" title="Expenditure Dashboard">
            <MemoizedExpenditureDashboard expenditures={expenditures} />
          </Tab>
          <Tab eventKey="budgetVsExpenditure" title="Budget vs Expenditure">
            <MemoizedBudgetVsExpenditureChart categories={prepareChartData()} />
          </Tab>
        </Tabs>
      )}
    </div>
  );
}
