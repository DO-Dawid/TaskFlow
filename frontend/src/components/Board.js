// src/components/Board.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';

function Board() {
    const [tasks, setTasks] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedProject, setSelectedProject] = useState('');

    useEffect(() => {
        fetchTasks();
        fetchDepartments();
        fetchUsers();
        fetchProjects();
    }, [selectedUser, selectedProject, selectedDepartment]);

    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get('tasks/', {
                params: {
                    department: selectedDepartment,
                    user: selectedUser,
                    project: selectedProject,
                }
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axiosInstance.get('departments/');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axiosInstance.get('projects/');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('users/');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };

    const handleFilterChange = () => {
        fetchTasks();
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Task Board</h2>
            <div className="mb-4">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label className="form-label">Filter by Department</label>
                        <select
                            className="form-select"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            {departments.map(department => (
                                <option key={department.id} value={department.id}>{department.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Filter by User</label>
                        <select
                            className="form-select"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            <option value="">All Users</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.username}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Filter by Project</label>
                        <select
                            className="form-select"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                        >
                            <option value="">All Projects</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

            </div>
            <div className="row">
                {tasks.map(task => (
                    <div key={task.id} className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <Link to={`/task/${task.id}`} className="text-decoration-none">
                                    <h5 className="card-title">{task.title}</h5>
                                    <p className="card-text">{task.description}</p>
                                    <p className="card-text"><strong>Assigned to:</strong> {task.user.username}</p>
                                    <p className="card-text"><strong>Department:</strong> {task.department ? task.department.name : 'None'}</p>
                                    <p className="card-text"><strong>Project:</strong> {task.project ? task.project.name : 'None'}</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Board;
