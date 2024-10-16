import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Expenditure } from '@/app/expenditures/page';

interface EditExpenditureProps {
  show: boolean;
  handleClose: () => void;
  handleUpdateExpenditure: (
    id: string,
    updatedExpenditure: Partial<Expenditure>
  ) => void;
  expenditure: Expenditure | null;
}

const EditExpenditure: React.FC<EditExpenditureProps> = ({
  show,
  handleClose,
  handleUpdateExpenditure,
  expenditure,
}) => {
  const [formData, setFormData] = useState<Partial<Expenditure>>({
    amount: 0,
    date: '',
    description: '',
  });

  useEffect(() => {
    if (expenditure) {
      setFormData({
        amount: expenditure.amount,
        date: expenditure.date.split('T')[0], // Format date for input
        description: expenditure.description,
      });
    }
  }, [expenditure]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenditure) {
      handleUpdateExpenditure(expenditure._id, formData);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Expenditure</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update Expenditure
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditExpenditure;
