// TaskDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

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
        <div>
            <h2>Task Details</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <h3>{task.title}</h3>
                <p>Description: {task.description}</p>
                <p>Assigned to: {task.user ? task.user.username : 'None'}</p>
                <p>Department: {task.department ? task.department.name : 'None'}</p>
                <p>Project: {task.project ? task.project.name : 'None'}</p>
                <p>Assigned by: {task.assigned_by ? task.assigned_by.username : 'None'}</p>
            </div>
            <button onClick={() => navigate(`/edittask/${id}`)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={() => navigate(`/board`)}>Back</button>
        </div>
    );
};

export default TaskDetail;
