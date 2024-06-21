import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Menu = ({ auth, setAuth }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuth(false);
        navigate('/login');
    };

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                {auth ? (
                    <>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li> {/* Dodaj link do rejestracji */}
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Menu;
