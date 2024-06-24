import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axiosInstance.get(`tasks/${id}/`);
                setTask(response.data);
            } catch (err) {
                setError('Failed to fetch task details.');
                console.error(err);
            }
        };

        fetchTask();
    }, [id]);

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            await axiosInstance.delete(`tasks/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/board');
        } catch (err) {
            setError('Failed to delete task.');
            console.error(err);
        }
    };

    if (!task) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Task Details</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="card">
                <div className="card-body">
                    <h3 className="card-title">{task.title}</h3>
                    <p className="card-text">Description: {task.description}</p>
                    <p className="card-text">Assigned to: {task.user.username}</p>
                    <p className="card-text">Department: {task.department ? task.department.name : 'None'}</p>
                    <p className="card-text">Project: {task.project ? task.project.name : 'None'}</p>
                    <p className="card-text">Assigned by: {task.assigned_by.username}</p>
                    <button className="btn btn-primary" onClick={() => navigate(`/edittask/${id}`)}>Edit</button>
                    <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                    <button className="btn btn-secondary" onClick={() => navigate(`/board`)}>Back</button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;
