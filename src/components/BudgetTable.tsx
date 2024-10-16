import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';

interface Subcategory {
  name: string;
  amount: number;
}

interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
}

interface BudgetTableProps {
  projectId: string;
  projectName: string;
  categories: Category[];
}

const BudgetTable: React.FC<BudgetTableProps> = ({
  projectId,
  projectName,
  categories,
}) => {
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
    <Container className="project-details">
      <h2 className="text-center mb-4">{projectName}</h2>
      {categories.map((category) => (
        <Card key={category._id} className="mb-4">
          <Card.Header as="h5" className="bg-dark text-white">
            {category.name}
          </Card.Header>
          <Card.Body>
            {category.subcategories.map((sub, index) => (
              <Row key={index} className="mb-2">
                <Col xs={8}>{sub.name}</Col>
                <Col xs={4} className="text-end">
                  Rs. {sub.amount.toFixed(2)}
                </Col>
                <hr />
              </Row>
            ))}
          </Card.Body>
        </Card>
      ))}
      <Card bg="primary" text="white">
        <Card.Body>
          <Row>
            <Col xs={8}>
              <strong>Total Budget</strong>
            </Col>
            <Col xs={4} className="text-end">
              <strong>Rs. {calculateTotalBudget().toFixed(2)}</strong>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BudgetTable;
