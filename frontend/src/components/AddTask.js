// AddTask.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddTask = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [userId, setUserId] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [assignedById, setAssignedById] = useState('');
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users/');
                setUsers(response.data);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/departments/');
                setDepartments(response.data);
            } catch (err) {
                console.error('Failed to fetch departments:', err);
            }
        };

        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/projects/');
                setProjects(response.data);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            }
        };

        fetchUsers();
        fetchDepartments();
        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:8000/api/add_task/', {
                title,
                description,
                user_id: userId,
                department_id: departmentId,
                project_id: projectId,
                assigned_by_id: assignedById,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccess('Task added successfully');
            setError('');
        } catch (err) {
            setError('Failed to add task. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div>
            <h2>Add Task</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>User</label>
                    <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Department</label>
                    <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                        <option value="">Select Department</option>
                        {departments.map(department => (
                            <option key={department.id} value={department.id}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Project</label>
                    <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                        <option value="">Select Project</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Assigned By</label>
                    <select value={assignedById} onChange={(e) => setAssignedById(e.target.value)} required>
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {success && <p style={{color: 'green'}}>{success}</p>}
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default AddTask;
