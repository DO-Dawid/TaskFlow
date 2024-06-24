import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/api/register/', { username, password, email }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 201) {
                navigate('/login');
            } else {
                setError(response.data.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error || `Registration failed. Server response: ${JSON.stringify(error.response.data)}`);
            } else {
                setError(`Registration failed. Please try again. Error: ${error.message}`);
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
                {error && <p className="text-danger mt-2">{error}</p>}
            </form>
        </div>
    );
};

export default Register;
