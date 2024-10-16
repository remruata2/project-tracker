"use client";

import { useEffect, useState } from "react";
import styles from "@/app/page.module.css";
import { Table, Button, Form, Modal, Row, Col } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";

interface Project {
  _id: string;
  name: string;
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

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

  const addProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (projectName.trim() === "") return;
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName }),
      });
      if (response.ok) {
        const newProject = await response.json();
        setProjects([...projects, newProject]);
        setProjectName("");
        setShowAddProjectModal(false);
      } else {
        throw new Error("Failed to add project");
      }
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const deleteProject = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setProjects(projects.filter((project) => project._id !== id));
        } else {
          throw new Error("Failed to delete project");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const updateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      const response = await fetch(`/api/projects/${editingProject._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingProject.name }),
      });
      if (response.ok) {
        const updatedProject = await response.json();
        setProjects(
          projects.map((p) =>
            p._id === updatedProject._id ? updatedProject : p,
          ),
        );
        setShowEditModal(false);
      } else {
        throw new Error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Project List</h1>
      <div className="mb-4">
        <Row>
          <Col>
            <Button
              variant="primary"
              className="me-2 float-end"
              onClick={() => setShowAddProjectModal(true)}
            >
              Add Project
            </Button>
          </Col>
        </Row>
      </div>
      <main className={styles.main}>
        {projects.length > 0 ? (
          <Table
            responsive
            striped
            bordered
            hover
            variant="dark"
            className="projectListTable"
          >
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>
                  <td>{project.name}</td>
                  <td>
                    <Link href={`/?projectId=${project._id}`}>
                      <Button variant="primary" size="sm" className="me-2">
                        Details
                      </Button>
                    </Link>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setEditingProject(project);
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteProject(project._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className={styles.emptyMessage}>
            No projects found. Add a new project to get started!
          </p>
        )}
      </main>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateProject}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                value={editingProject?.name || ""}
                onChange={(e) =>
                  setEditingProject(
                    editingProject
                      ? { ...editingProject, name: e.target.value }
                      : null,
                  )
                }
                placeholder="Enter Project Name"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Project
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        show={showAddProjectModal}
        onHide={() => setShowAddProjectModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addProject} className={styles.form}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter Project Name"
                required
              />
            </Form.Group>
            <Button variant="primary mb-3" type="submit">
              Add Project
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
