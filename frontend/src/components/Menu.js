// Menu.js
import React from 'react';
import { Link } from 'react-router-dom';

const Menu = ({ isAuthenticated, username, logout }) => {
    return (
        <nav>
            <ul>
                {isAuthenticated ? (
                    <>
                        <li>Welcome, {username}</li>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/addtask">Add Task</Link></li>
                        <li><Link to="/addproject">Add Project</Link></li>
                        <li><Link to="/adddepartment">Add Department</Link></li>
                        <li><Link to="/addsubtask">Add Subtask</Link></li>
                        <li><Link to="/addboard">Add Board</Link></li>
                        <li><button onClick={logout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Menu;
