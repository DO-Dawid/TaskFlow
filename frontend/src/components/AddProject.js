import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const AddProject = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axiosInstance.get('departments/');
                setDepartments(response.data);
            } catch (err) {
                console.error('Failed to fetch departments:', err);
            }
        };

        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axiosInstance.post('projects/', {
                name,
                description,
                department_id: departmentId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccess('Project added successfully');
            setError('');
        } catch (err) {
            setError('Failed to add project. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="container">
            <h2>Add Project</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                    />
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
                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}
                <button type="submit" className="btn btn-primary">Add Project</button>
            </form>
        </div>
    );
};

export default AddProject;
