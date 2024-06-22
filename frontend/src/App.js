// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AddTask from './components/AddTask';
import AddProject from './components/AddProject';
import AddDepartment from './components/AddDepartment';
import AddSubtask from './components/AddSubtask';
import AddBoard from './components/AddBoard';
import Home from './components/Home';
import Menu from './components/Menu';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (token && storedUsername) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUsername('');
    };

    return (
        <Router>
            <div>
                <Menu isAuthenticated={isAuthenticated} username={username} logout={logout} />
                <Routes>
                    <Route path="/login" element={<Login setAuth={setIsAuthenticated} setUsername={setUsername} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/addtask" element={<ProtectedRoute><AddTask /></ProtectedRoute>} />
                    <Route path="/addproject" element={<ProtectedRoute><AddProject /></ProtectedRoute>} />
                    <Route path="/adddepartment" element={<ProtectedRoute><AddDepartment /></ProtectedRoute>} />
                    <Route path="/addsubtask" element={<ProtectedRoute><AddSubtask /></ProtectedRoute>} />
                    <Route path="/addboard" element={<ProtectedRoute><AddBoard /></ProtectedRoute>} />
                    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
