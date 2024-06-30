import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
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
        const fetchTask = async () => {
            try {
                const response = await axiosInstance.get(`tasks/${id}/`);
                const taskData = response.data;
                setTask(taskData);
                setTitle(taskData.title);
                setDescription(taskData.description);
                setUserId(taskData.user.id);
                setDepartmentId(taskData.department ? taskData.department.id : '');
                setProjectId(taskData.project ? taskData.project.id : '');
                setAssignedById(taskData.assigned_by.id);
            } catch (err) {
                setError('Failed to fetch task details.');
                console.error(err);
            }
        };

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

        fetchTask();
        fetchUsers();
        fetchDepartments();
        fetchProjects();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axiosInstance.put(`tasks/${id}/`, {
                title,
                description,
                user_id: userId,
                department_id: departmentId,
                project_id: projectId,
                assigned_by_id: assignedById,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Task updated successfully');
            setError('');
            navigate(`/task/${id}`);
        } catch (err) {
            setError('Failed to update task. Please try again.');
            setSuccess('');
        }
    };

    if (!task) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Edit Task</h2>
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input
                        type="text"
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="user" className="form-label">User</label>
                    <select
                        className="form-select"
                        id="user"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    >
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="department" className="form-label">Department</label>
                    <select
                        className="form-select"
                        id="department"
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                    >
                        <option value="">Select Department</option>
                        {departments.map(department => (
                            <option key={department.id} value={department.id}>{department.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="project" className="form-label">Project</label>
                    <select
                        className="form-select"
                        id="project"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                    >
                        <option value="">Select Project</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="assignedBy" className="form-label">Assigned By</label>
                    <select
                        className="form-select"
                        id="assignedBy"
                        value={assignedById}
                        onChange={(e) => setAssignedById(e.target.value)}
                        required
                    >
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Update Task</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate(`/task/${id}`)}>Cancel</button>
            </form>
        </div>
    );
};

export default EditTask;
