import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AddTask from './components/AddTask';
import AddProject from './components/AddProject';
import AddDepartment from './components/AddDepartment';
import AddSubtask from './components/AddSubtask';
import Home from './components/Home';
import Menu from './components/Menu';
import ProtectedRoute from './components/ProtectedRoute';
import Board from './components/Board';
import TaskDetail from './components/TaskDetails';
import EditTask from './components/EditTask';
import AccountSuccess from './components/AccountSuccess';

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
                    <Route path="/addsubtask/:taskId" element={<ProtectedRoute><AddSubtask /></ProtectedRoute>} />
                    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/board" element={<ProtectedRoute><Board /></ProtectedRoute>} />
                    <Route path="/task/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
                    <Route path="/edittask/:id" element={<ProtectedRoute><EditTask /></ProtectedRoute>} />
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/account-success" element={<AccountSuccess />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
