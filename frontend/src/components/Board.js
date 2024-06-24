// src/components/Board.js
import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import axiosInstance from '../axiosInstance';



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

    const fetchProjects = async () =>{
        try{
            const response = await axiosInstance.get('projects/');
            setProjects(response.data)
        } catch (error) {
            console.error('Error fetching projects', error);
        }
    }

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
        <div>
            <h2>Task Board</h2>
            <div>
                <label>Filter by Department</label>
                <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                    <option value="">All Departments</option>
                    {departments.map(department => (
                        <option key={department.id} value={department.id}>{department.name}</option>
                    ))}
                </select>

                <label>Filter by User</label>
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">All Users</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.username}</option>
                    ))}
                </select>

                <label>Filter by Project</label>
                <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                    <option value="">All Projects</option>
                    {projects.map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                </select>

                <button onClick={handleFilterChange}>Apply Filters</button>
            </div>
            <div>
                {tasks.map(task => (
                    <div key={task.id}>
                        <Link to={`/task/${task.id}`}>
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <p>Assigned to: {task.user.username}</p>
                            <p>Department: {task.department ? task.department.name : 'None'}</p>
                            <p>Project: {task.project ? task.project.name : 'None'}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Board;
