import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddBoard = () => {
    const [name, setName] = useState('');
    const [tasks, setTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/tasks/');
                setTasks(response.data);
            } catch (err) {
                console.error('Failed to fetch tasks:', err);
            }
        };

        fetchTasks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:8000/api/boards/', {
                name,
                tasks: selectedTasks,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccess('Board added successfully');
            setError('');
        } catch (err) {
            setError('Failed to add board. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div>
            <h2>Add Board</h2>
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
                <div>
                    <label>Tasks</label>
                    <select multiple value={selectedTasks} onChange={(e) => setSelectedTasks([...e.target.selectedOptions].map(option => option.value))} required>
                        {tasks.map(task => (
                            <option key={task.id} value={task.id}>
                                {task.title}
                            </option>
                        ))}
                    </select>
                </div>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {success && <p style={{color: 'green'}}>{success}</p>}
                <button type="submit">Add Board</button>
            </form>
        </div>
    );
};

export default AddBoard;
