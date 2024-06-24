import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const Menu = ({ isAuthenticated, username, logout }) => {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">TaskFlow</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/home">Home</Nav.Link>
                                <Nav.Link as={Link} to="/board">Board</Nav.Link>
                                <NavDropdown title="Add" id="basic-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/addtask">Add Task</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/addproject">Add Project</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/adddepartment">Add Department</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                    {isAuthenticated && (
                        <Nav>
                            <Nav.Link>{`Welcome, ${username}`}</Nav.Link>
                            <Nav.Link onClick={logout}>Logout</Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Menu;
