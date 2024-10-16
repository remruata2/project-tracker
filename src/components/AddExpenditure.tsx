import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

interface Expenditure {
  projectId: { _id: string };
  categoryId: { _id: string; name: string };
  subCategoryId: { _id: string; name: string };
  amount: number;
  description: string;
  date: string;
}

type ExpenditureWithoutId = Omit<Expenditure, '_id'>;

interface AddExpenditureProps {
  show: boolean;
  handleClose: () => void;
  handleAddExpenditure: (expenditures: ExpenditureWithoutId[]) => void;
}

interface Category {
  _id: string;
  name: string;
  subcategories: { _id: string; name: string }[];
}

interface Project {
  _id: string;
  name: string;
}

const AddExpenditure: React.FC<AddExpenditureProps> = ({
  show,
  handleClose,
  handleAddExpenditure,
}) => {
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState('');
  const [expenditures, setExpenditures] = useState<
    Partial<ExpenditureWithoutId>[]
  >([
    {
      categoryId: { _id: '', name: '' },
      subCategoryId: { _id: '', name: '' },
      amount: 0,
      description: '',
    },
  ]);
  const [projects, setProjects] = useState<Project[]>([]);
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
    const response = await fetch('/api/projects');
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
    field: keyof ExpenditureWithoutId,
    value: string
  ) => {
    const newExpenditures = [...expenditures];
    if (field === 'categoryId' || field === 'subCategoryId') {
      newExpenditures[index] = {
        ...newExpenditures[index],
        [field]: { _id: value, name: '' },
      };
    } else if (field === 'amount') {
      newExpenditures[index] = {
        ...newExpenditures[index],
        [field]: parseFloat(value) || 0,
      };
    } else {
      newExpenditures[index] = { ...newExpenditures[index], [field]: value };
    }
    setExpenditures(newExpenditures);
  };

  const handleAddMore = () => {
    setExpenditures([
      ...expenditures,
      {
        categoryId: { _id: '', name: '' },
        subCategoryId: { _id: '', name: '' },
        amount: 0,
        description: '',
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expendituresToAdd: ExpenditureWithoutId[] = expenditures.map(
      (exp) => ({
        projectId: { _id: projectId },
        categoryId: exp.categoryId as { _id: string; name: string },
        subCategoryId: exp.subCategoryId as { _id: string; name: string },
        amount: exp.amount as number,
        description: exp.description || '',
        date: date,
      })
    );
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
                    value={expenditure.categoryId?._id || ''}
                    onChange={(e) =>
                      handleExpenditureChange(
                        index,
                        'categoryId',
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
                    value={expenditure.subCategoryId?._id || ''}
                    onChange={(e) =>
                      handleExpenditureChange(
                        index,
                        'subCategoryId',
                        e.target.value
                      )
                    }
                    required
                  >
                    <option value="">Select a subcategory</option>
                    {categories
                      .find((cat) => cat._id === expenditure.categoryId?._id)
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
                    value={expenditure.description || ''}
                    onChange={(e) =>
                      handleExpenditureChange(
                        index,
                        'description',
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
                    value={expenditure.amount || ''}
                    onChange={(e) =>
                      handleExpenditureChange(index, 'amount', e.target.value)
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
