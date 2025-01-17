import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Auth.css'; // Import the new CSS file

function Login({ setAuth, setUsername }) {
    const [username, setLoginUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                username,
                password
            });
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('user_id', response.data.user_id);
            setAuth(true);
            setUsername(response.data.username);
            navigate('/home');
        } catch (err) {
            setError('Login failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="mb-3 form-control"
                            value={username}
                            onChange={(e) => setLoginUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3 form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
