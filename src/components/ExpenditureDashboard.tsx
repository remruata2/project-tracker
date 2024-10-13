import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Expenditure } from "../app/expenditures/page";

interface DashboardProps {
  expenditures: Expenditure[];
  projectId: string;
}

const ExpenditureDashboard: React.FC<DashboardProps> = ({
  expenditures,
  projectId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateTotals = () => {
    const categoryTotals: { [key: string]: number } = {};
    const subCategoryTotals: { [key: string]: { [key: string]: number } } = {};
    let overallTotal = 0;

    if (Array.isArray(expenditures)) {
      expenditures.forEach((exp) => {
        const categoryId = exp.categoryId._id;
        const subCategoryId = exp.subCategoryId._id;
        const amount = exp.amount;

        categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + amount;

        if (!subCategoryTotals[categoryId]) {
          subCategoryTotals[categoryId] = {};
        }
        subCategoryTotals[categoryId][subCategoryId] =
          (subCategoryTotals[categoryId][subCategoryId] || 0) + amount;

        overallTotal += amount;
      });
    }

    return { categoryTotals, subCategoryTotals, overallTotal };
  };

  const { categoryTotals, subCategoryTotals, overallTotal } = calculateTotals();

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <Card bg="dark" text="white">
            <Card.Body>
              <Card.Title>Overall Total</Card.Title>
              <Card.Text>{formatCurrency(overallTotal)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <h5>Category Totals</h5>
          <Row xs={1} md={2} lg={3} className="g-4">
            {Object.entries(categoryTotals).map(([categoryId, total]) => (
              <Col key={categoryId}>
                <Card
                  bg={selectedCategory === categoryId ? "success" : "primary"}
                  text="white"
                  onClick={() => handleCategoryClick(categoryId)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body>
                    <Card.Title>
                      {
                        expenditures?.find(
                          (exp) => exp.categoryId._id === categoryId
                        )?.categoryId.name
                      }
                    </Card.Title>
                    <Card.Text style={{ fontSize: "1.8rem" }}>
                      {formatCurrency(total)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      {selectedCategory && (
        <Row className="mb-3">
          <Col>
            <hr />
            <h1>
              Subcategories for{" "}
              {
                expenditures?.find(
                  (exp) => exp.categoryId._id === selectedCategory
                )?.categoryId.name
              }
            </h1>
            <Row xs={1} md={2} lg={3} className="g-4">
              {Object.entries(subCategoryTotals[selectedCategory] || {}).map(
                ([subCategoryId, total]) => (
                  <Col key={subCategoryId}>
                    <Card bg="danger" text="white">
                      <Card.Body>
                        <Card.Title>
                          {
                            expenditures.find(
                              (exp) => exp.subCategoryId._id === subCategoryId
                            )?.subCategoryId.name
                          }
                        </Card.Title>
                        <Card.Text style={{ fontSize: "1.8rem" }}>
                          {formatCurrency(total)}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              )}
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ExpenditureDashboard;
