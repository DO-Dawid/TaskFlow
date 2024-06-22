import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSubtask = () => {
    const [title, setTitle] = useState('');
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);
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
            const response = await axios.post('http://localhost:8000/api/subtasks/', {
                title,
                task,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccess('Subtask added successfully');
            setError('');
        } catch (err) {
            setError('Failed to add subtask. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div>
            <h2>Add Subtask</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Task</label>
                    <select value={task} onChange={(e) => setTask(e.target.value)} required>
                        <option value="">Select Task</option>
                        {tasks.map(task => (
                            <option key={task.id} value={task.id}>
                                {task.title}
                            </option>
                        ))}
                    </select>
                </div>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {success && <p style={{color: 'green'}}>{success}</p>}
                <button type="submit">Add Subtask</button>
            </form>
        </div>
    );
};

export default AddSubtask;
