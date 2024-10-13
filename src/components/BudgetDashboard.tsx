import React, { useState, useEffect } from "react";
import { Card, Row, Col, Modal, Button, Form } from "react-bootstrap";
import styles from "./BudgetDashboard.module.css";

export interface Project {
  _id: string;
  name: string;
}

interface Subcategory {
  _id: string;
  name: string;
  amount: number;
}

interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
  projectId: Project;
}

interface BudgetDashboardProps {
  projectId: string;
  categories: Category[];
}

const formatIndianNumber = (num: number): string => {
  const formatted = num.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
    useGrouping: true,
  });
  return `Rs. ${formatted}`;
};

const BudgetDashboard: React.FC<BudgetDashboardProps> = ({
  projectId,
  categories,
}) => {
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [editingSubcategory, setEditingSubcategory] =
    useState<Subcategory | null>(null);

  const cardColors = ["primary", "success", "secondary"];

  useEffect(() => {
    // Calculate total budget whenever categories change
    const newTotal = categories.reduce(
      (sum: number, category: Category) => sum + getCategoryTotal(category),
      0
    );
    setTotalBudget(newTotal);
  }, [categories]);

  const getCategoryTotal = (category: Category): number => {
    return category.subcategories.reduce(
      (sum, subcategory) => sum + subcategory.amount,
      0
    );
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setEditingSubcategory(null);
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
  };

  const handleSaveSubcategory = async () => {
    if (!editingSubcategory || !selectedCategory) return;

    try {
      const response = await fetch(
        `/api/subCategories/${editingSubcategory._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: editingSubcategory.amount }),
        }
      );

      if (response.ok) {
        // Update logic should be handled in the parent component
        // Here we just close the editing state
        setEditingSubcategory(null);
      } else {
        throw new Error("Failed to update subcategory");
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <Card className={`${styles.card} ${styles.totalBudgetCard}`}>
        <Card.Body>
          <Card.Title>Total Budget</Card.Title>
          <Card.Text className={styles.totalAmount}>
            {formatIndianNumber(totalBudget)}
          </Card.Text>
        </Card.Body>
      </Card>
      <Row xs={1} md={2} lg={3} className="g-4">
        {categories.map((category, index) => (
          <Col key={category._id}>
            <Card
              className={`${styles.card} bg-${
                cardColors[index % cardColors.length]
              } text-white`}
              onClick={() => handleCategoryClick(category)}
            >
              <Card.Body>
                <Card.Title>{category.name}</Card.Title>
                <Card.Text className={styles.amount}>
                  {formatIndianNumber(getCategoryTotal(category))}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedCategory?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row xs={1} md={2} className="g-4">
            {selectedCategory?.subcategories.map((subcategory) => (
              <Col key={subcategory._id}>
                <Card className={styles.subcategoryCard}>
                  <Card.Body>
                    <Card.Title>{subcategory.name}</Card.Title>
                    <Card.Text>
                      {editingSubcategory?._id === subcategory._id ? (
                        <Form.Control
                          type="number"
                          value={editingSubcategory.amount}
                          onChange={(e) =>
                            setEditingSubcategory({
                              ...editingSubcategory,
                              amount: Number(e.target.value),
                            })
                          }
                        />
                      ) : (
                        <span className={styles.cardAmount}>
                          {formatIndianNumber(subcategory.amount)}
                        </span>
                      )}
                    </Card.Text>
                    <div className={styles.cardActions}>
                      {editingSubcategory?._id === subcategory._id ? (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={handleSaveSubcategory}
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEditingSubcategory(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditSubcategory(subcategory)}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BudgetDashboard;
