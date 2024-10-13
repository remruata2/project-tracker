"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Alert,
  Modal,
  Card,
  Row,
  Col,
  Container,
  Form,
  Pagination,
} from "react-bootstrap";
import AddExpenditure from "../../components/AddExpenditure";
import EditExpenditure from "../../components/EditExpenditure";
import ExpenditureDashboard from "../../components/ExpenditureDashboard";
import styles from "@/app/page.module.css";

export interface Expenditure {
  _id?: string;
  projectId: string;
  categoryId: {
    _id: string;
    name: string;
    subCategories: { _id: string; name: string }[];
  };
  subCategoryId: {
    _id: string;
    name: string;
  };
  amount: number;
  date: string;
  description: string;
}

interface DeleteConfirmationModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}
export default function Expenditures() {
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [notification, setNotification] = useState<{
    type: string;
    message: string;
  } | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [expenditureToDelete, setExpenditureToDelete] = useState<string | null>(
    null
  );
  const [selectedExpenditure, setSelectedExpenditure] =
    useState<Expenditure | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expendituresPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchExpenditures(currentPage);
  }, [currentPage, expendituresPerPage]);

  async function fetchExpenditures(page = 1) {
    try {
      const res = await fetch(
        `/api/expenditures?page=${page}&limit=${expendituresPerPage}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setExpenditures(data.expenditures);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching expenditures:", error);
      setExpenditures([]);
    }
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    fetchExpenditures(pageNumber);
  };

  const handleAddExpenditure = (newExpenditure: Omit<Expenditure, "_id">[]) => {
    fetch("/api/expenditures", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExpenditure),
    })
      .then((res) => {
        if (res.ok) {
          fetchExpenditures();
          setNotification({
            type: "success",
            message: "Expenditure added successfully!",
          });
        } else {
          setNotification({
            type: "danger",
            message: "Failed to add expenditure",
          });
        }
      })
      .catch((error) => {
        console.error("Error adding expenditure:", error);
        setNotification({
          type: "danger",
          message: "Error adding expenditure",
        });
      });
  };

  const handleDeleteExpenditure = (id: string) => {
    setExpenditureToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (expenditureToDelete) {
      fetch(`/api/expenditures/${expenditureToDelete}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            fetchExpenditures();
            setNotification({
              type: "success",
              message: "Expenditure deleted successfully!",
            });
          } else {
            setNotification({
              type: "danger",
              message: "Failed to delete expenditure",
            });
          }
        })
        .catch((error) => {
          setNotification({
            type: "danger",
            message: "Error deleting expenditure",
          });
        });
    }
    setShowDeleteConfirmation(false);
    setExpenditureToDelete(null);
  };

  const handleUpdateExpenditure = (
    id: string,
    updatedExpenditure: Partial<Expenditure>
  ) => {
    fetch(`/api/expenditures/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedExpenditure),
    })
      .then((res) => {
        if (res.ok) {
          fetchExpenditures();
          setNotification({
            type: "success",
            message: "Expenditure updated successfully!",
          });
        } else {
          setNotification({
            type: "danger",
            message: "Failed to update expenditure!",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating expenditure:", error);
        setNotification({
          type: "danger",
          message: "Error updating expenditure",
        });
      });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    show,
    handleClose,
    handleConfirm,
  }) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this expenditure?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <Container className="mt-4">
      <h1>Expenditures</h1>
      <Row>
        <Col>
          <Button
            variant="primary"
            className="mb-3 me-3"
            onClick={() => setShowAddModal(true)}
          >
            Add New
          </Button>
        </Col>
        <Col>
          <Button
            variant="danger"
            className="mb-3 me-3"
            onClick={() => setShowDashboard(true)}
          >
            Dashboard
          </Button>
        </Col>
        <Col>
          <Form.Group>
            <Form.Control type="date" />
          </Form.Group>
        </Col>
      </Row>
      {notification && (
        <Alert
          variant={notification.type}
          onClose={() => setNotification(null)}
          dismissible
        >
          {notification.message}
        </Alert>
      )}
      <Row xs={1} md={2} lg={3} className="g-4">
        {expenditures?.length > 0 ? (
          expenditures.map((expenditure) => (
            <Col key={expenditure._id}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {new Date(expenditure.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {expenditure.categoryId.name}
                    <p className="text-danger small mb-0">
                      {expenditure.subCategoryId.name}
                    </p>
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Amount:</strong> Rs. {expenditure.amount.toFixed(2)}
                    <br />
                    <strong>Description:</strong> {expenditure.description}
                  </Card.Text>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setSelectedExpenditure(expenditure);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteExpenditure(expenditure._id)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className={styles.emptyMessage}>No Expenditures found</p>
          </Col>
        )}
      </Row>

      <Pagination className="mt-3 justify-content-center">
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>

      <AddExpenditure
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleAddExpenditure={handleAddExpenditure}
      />
      <EditExpenditure
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        handleUpdateExpenditure={handleUpdateExpenditure}
        expenditure={selectedExpenditure}
      />

      <DeleteConfirmationModal
        show={showDeleteConfirmation}
        handleClose={() => setShowDeleteConfirmation(false)}
        handleConfirm={confirmDelete}
      />
      <ExpenditureDashboard
        show={showDashboard}
        handleClose={() => setShowDashboard(false)}
        expenditures={expenditures}
      />
    </Container>
  );
}
