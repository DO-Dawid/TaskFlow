import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccountSuccess = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className="container mt-5">
            <div className="alert alert-success" role="alert">
                <h2 className="alert-heading">Account Successfully Created</h2>
                <p>Your account has been successfully created. You can now log in.</p>
                <hr />
                <button className="btn btn-primary" onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
};

export default AccountSuccess;
