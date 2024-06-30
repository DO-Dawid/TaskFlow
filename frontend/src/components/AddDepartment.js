import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const AddDepartment = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('departments/', { name });
            setSuccess('Department added successfully');
            setError('');
            setName('');
            navigate(`/board`);
        } catch (err) {
            setError('Failed to add department. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="container">
            <h2>Add Department</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Department Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}
                <button type="submit" className="btn btn-primary">Add Department</button>
            </form>
        </div>
    );
};

export default AddDepartment;
