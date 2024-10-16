'use client';

import React from 'react';
import { Navbar, Nav, Container, Offcanvas } from 'react-bootstrap';
import Link from 'next/link';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-3">
      <Container fluid>
        <Navbar.Brand as={Link} href="/">
          Project Budget Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />
        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-lg"
          aria-labelledby="offcanvasNavbarLabel-expand-lg"
          placement="start"
          className="bg-primary text-white"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link as={Link} href="/" className={styles.navLink}>
                Home
              </Nav.Link>

              <Nav.Link as={Link} href="/categories" className={styles.navLink}>
                Categories
              </Nav.Link>
              <Nav.Link
                as={Link}
                href="/expenditures"
                className={styles.navLink}
              >
                Expenditures
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Header;
