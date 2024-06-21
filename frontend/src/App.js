import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Menu from './components/Menu';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
    const [auth, setAuth] = useState(!!localStorage.getItem('token'));

    return (
        <Router>
            <div className="App">
                <Menu auth={auth} setAuth={setAuth} />
                <Routes>
                    <Route path="/login" element={<Login setAuth={setAuth} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<ProtectedRoute auth={auth}><Home /></ProtectedRoute>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
