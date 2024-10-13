import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Expenditure } from "@/app/expenditures/page";

interface AddExpenditureProps {
  show: boolean;
  handleClose: () => void;
  handleAddExpenditure: (expenditures: Omit<Expenditure, "_id">[]) => void;
}

interface Category {
  _id: string;
  name: string;
  subcategories: { _id: string; name: string }[];
}

const AddExpenditure: React.FC<AddExpenditureProps> = ({
  show,
  handleClose,
  handleAddExpenditure,
}: AddExpenditureProps) => {
  const [projectId, setProjectId] = useState("");
  const [date, setDate] = useState("");
  const [expenditures, setExpenditures] = useState([
    {
      categoryId: "",
      subCategoryId: "",
      amount: "",
      description: "",
    },
  ]);
  const [projects, setProjects] = useState<{ _id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchCategories(projectId);
    } else {
      setCategories([]);
    }
  }, [projectId]);

  const fetchProjects = async () => {
    const response = await fetch("/api/projects");
    const data = await response.json();
    setProjects(data);
  };

  const fetchCategories = async (id: string) => {
    if (id) {
      const response = await fetch(`/api/categories?projectId=${id}`);
      const data = await response.json();
      setCategories(data);
    }
  };

  const handleExpenditureChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newExpenditures = [...expenditures];
    newExpenditures[index] = { ...newExpenditures[index], [field]: value };
    setExpenditures(newExpenditures);
  };
  console.log(expenditures[0]);

  const handleAddMore = () => {
    setExpenditures([
      ...expenditures,
      {
        categoryId: "",
        subCategoryId: "",
        amount: "",
        description: "",
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expendituresToAdd = expenditures.map((exp) => ({
      ...exp,
      projectId,
      date,
      amount: parseFloat(exp.amount),
    }));
    console.log(expendituresToAdd);
    handleAddExpenditure(expendituresToAdd);
    handleClose();
  };

  const handleDeleteRow = (index: number) => {
    const newExpenditures = expenditures.filter((_, i) => i !== index);
    setExpenditures(newExpenditures);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Expenditures</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Project</Form.Label>
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
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {expenditures.map((expenditure, index) => (
            <Row key={index} className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={expenditure.categoryId}
                    onChange={(e) =>
                      handleExpenditureChange(
                        index,
                        "categoryId",
                        e.target.value
                      )
                    }
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Subcategory</Form.Label>
                  <Form.Select
                    value={expenditure.subCategoryId}
                    onChange={(e) =>
                      handleExpenditureChange(
                        index,
                        "subCategoryId",
                        e.target.value
                      )
                    }
                    required
                  >
                    <option value="">Select a subcategory</option>
                    {categories
                      .find((cat) => cat._id === expenditure.categoryId)
                      ?.subcategories?.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      )) || []}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={expenditure.description}
                    onChange={(e) =>
                      handleExpenditureChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={expenditure.amount}
                    onChange={(e) =>
                      handleExpenditureChange(index, "amount", e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                {index > 0 && (
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteRow(index)}
                    className="mb-3"
                  >
                    Delete
                  </Button>
                )}
              </Col>
            </Row>
          ))}

          <Button variant="secondary" onClick={handleAddMore} className="mb-3">
            Add Another Expenditure
          </Button>

          <Button variant="primary" type="submit" className="float-end">
            Save Expenditures
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddExpenditure;
