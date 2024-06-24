import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

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
                const response = await axiosInstance.get('users/');
                setUsers(response.data);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await axiosInstance.get('departments/');
                setDepartments(response.data);
            } catch (err) {
                console.error('Failed to fetch departments:', err);
            }
        };

        const fetchProjects = async () => {
            try {
                const response = await axiosInstance.get('projects/');
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
        try {
            const response = await axiosInstance.post('add_task/', {
                title,
                description,
                user_id: userId,
                department_id: departmentId,
                project_id: projectId,
                assigned_by_id: assignedById,
            });
            setSuccess('Task added successfully');
            setError('');
        } catch (err) {
            setError('Failed to add task. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="container">
            <h2>Add Task</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <input
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>User</label>
                    <select className="form-control" value={userId} onChange={(e) => setUserId(e.target.value)} required>
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Department</label>
                    <select className="form-control" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                        <option value="">Select Department</option>
                        {departments.map(department => (
                            <option key={department.id} value={department.id}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Project</label>
                    <select className="form-control" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                        <option value="">Select Project</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Assigned By</label>
                    <select className="form-control" value={assignedById} onChange={(e) => setAssignedById(e.target.value)} required>
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>
                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}
                <button type="submit" className="btn btn-primary">Add Task</button>
            </form>
        </div>
    );
};

export default AddTask;
