"use client";

import { useEffect, useState } from "react";
import styles from "@/app/page.module.css";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const response = await fetch("/api/projects");
    if (response.ok) {
      const data = await response.json();
      setProjects(data);
    } else {
      console.error("Failed to fetch projects");
    }
  };

  const addProject = async (e) => {
    e.preventDefault();
    if (projectName.trim() === "") return; // Prevent empty submissions
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: projectName }),
    });
    if (response.ok) {
      setProjectName("");
      fetchProjects();
    } else {
      console.error("Failed to add project");
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Project Budget Tracker</h1>
        <form onSubmit={addProject} className={styles.form}>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter Project Name"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Add Project
          </button>
        </form>

        <h2>Projects List</h2>
        {projects.length > 0 ? (
          <ul className={styles.list}>
            {projects.map((project) => (
              <li key={project._id} className={styles.listItem}>
                {project.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyMessage}>
            No projects found. Add a new project to get started!
          </p>
        )}
      </main>
    </div>
  );
}
