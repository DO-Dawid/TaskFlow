import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [subtasks, setSubtasks] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const currentUser = localStorage.getItem('username');

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axiosInstance.get(`tasks/${id}/`);
                setTask(response.data);
            } catch (err) {
                setError('Failed to fetch task details.');
                console.error(err);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axiosInstance.get(`comments/?task=${id}`);
                setComments(response.data);
            } catch (err) {
                setError('Failed to fetch comments.');
                console.error(err);
            }
        };

        const fetchSubtasks = async () => {
            try {
                const response = await axiosInstance.get(`subtasks/?task=${id}`);
                setSubtasks(response.data);
            } catch (err) {
                setError('Failed to fetch subtasks.');
                console.error(err);
            }
        };

        fetchTask();
        fetchComments();
        fetchSubtasks();
    }, [id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        try {
            const response = await axiosInstance.post('add_comment/', {
                task_id: id,
                content: newComment,
                user_id: userId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const newCommentData = response.data;
            setComments([...comments, newCommentData]);
            setNewComment('');
        } catch (err) {
            setError('Failed to add comment.');
            console.error(err);
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            await axiosInstance.delete(`tasks/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/board');
        } catch (err) {
            setError('Failed to delete task.');
            console.error(err);
        }
    };

    const handleEdit = () => {
        if (task?.assigned_by?.username !== currentUser) {
            setError('You did not create this task.');
            return;
        }
        navigate(`/edittask/${id}`);
    };

    const handleSubtaskStatusChange = async (subtaskId, status) => {
        const token = localStorage.getItem('token');
        try {
            await axiosInstance.patch(`subtasks/${subtaskId}/`, {
                status: status
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSubtasks(subtasks.map(st => st.id === subtaskId ? { ...st, status: status, is_completed: status === 'done' } : st));
        } catch (err) {
            setError('Failed to update subtask status.');
            console.error(err);
        }
    };

    const handleDeleteSubtask = async (subtaskId) => {
        const token = localStorage.getItem('token');
        try {
            await axiosInstance.delete(`subtasks/${subtaskId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSubtasks(subtasks.filter(st => st.id !== subtaskId));
        } catch (err) {
            setError('Failed to delete subtask.');
            console.error(err);
        }
    };

    if (!task) {
        return <div>Loading...</div>;
    }

    const completionPercentage = subtasks.length > 0
        ? Math.round((subtasks.filter(st => st.status === 'done').length / subtasks.length) * 100)
        : 0;

    return (
        <div className="container mt-5">
            <h2>Task Details</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="card mb-3">
                <div className="card-body">
                    <h3 className="card-title">{task.title}</h3>
                    <p className="card-text">Description: {task.description}</p>
                    <p className="card-text">Assigned to: {task.user?.username}</p>
                    <p className="card-text">Department: {task.department ? task.department.name : 'None'}</p>
                    <p className="card-text">Project: {task.project ? task.project.name : 'None'}</p>
                    <p className="card-text">Assigned by: {task.assigned_by?.username}</p>
                    <p className="card-text">Completion: {completionPercentage}%</p>
                    <div className="progress">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${completionPercentage}%` }}
                            aria-valuenow={completionPercentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            {completionPercentage}%
                        </div>
                    </div>
                    <div>
                        {task.assigned_by?.username === currentUser && (
                            <>
                                <button onClick={handleEdit} className="btn btn-primary me-2">Edit</button>
                                <button onClick={handleDelete} className="btn btn-danger">Delete</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="mb-3">
                <h4>Subtasks</h4>
                {subtasks.length > 0 ? (
                    subtasks.map(subtask => (
                        <div key={subtask.id} className={`card mb-2 ${subtask.status === 'done' ? 'bg-success text-white' : ''}`}>
                            <div className="card-body">
                                <p className="card-text">{subtask.title}</p>
                                <p className="card-text">Status: {subtask.status}</p>
                                {subtask.status !== 'done' && (
                                    <div>
                                        {subtask.status !== 'in_progress' && (
                                            <button onClick={() => handleSubtaskStatusChange(subtask.id, 'in_progress')} className="btn btn-warning me-2">In Progress</button>
                                        )}
                                        <button onClick={() => handleSubtaskStatusChange(subtask.id, 'done')} className="btn btn-success me-2">Done</button>
                                        {task.user?.username === currentUser && (
                                            <button onClick={() => handleDeleteSubtask(subtask.id)} className="btn btn-danger">Delete</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No subtasks available.</p>
                )}
            </div>
            <div className="mt-3">
                <button className="btn btn-secondary" onClick={() => navigate(`/addsubtask/${id}`)}>Add Subtask</button>
            </div>
            <div className="mb-3">
                <h4>Comments</h4>
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="card mb-2">
                            <div className="card-body">
                                <p className="card-text">{comment.content}</p>
                                <p className="card-text">By: {comment.user?.username} on {new Date(comment.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No comments available.</p>
                )}
                <form onSubmit={handleAddComment}>
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Comment</button>
                </form>
            </div>
        </div>
    );
};

export default TaskDetail;
