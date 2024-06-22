import React, { useState } from 'react';
import axios from 'axios';

const AddDepartment = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:8000/api/departments/', {
                name,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccess('Department added successfully');
            setError('');
        } catch (err) {
            setError('Failed to add department. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div>
            <h2>Add Department</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {success && <p style={{color: 'green'}}>{success}</p>}
                <button type="submit">Add Department</button>
            </form>
        </div>
    );
};

export default AddDepartment;
