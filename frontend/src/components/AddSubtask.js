import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import './Background.css';

const AddSubtask = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axiosInstance.post('subtasks/', {
                title,
                task: taskId,
                status: 'new'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccess('Subtask added successfully');
            setError('');
            navigate(`/task/${taskId}`);
        } catch (err) {
            setError('Failed to add subtask. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Add Subtask</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow">
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button type="submit" className="btn btn-primary me-2">Add Subtask</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate(`/task/${taskId}`)}>Cancel</button>
            </form>
        </div>
    );
};

export default AddSubtask;
