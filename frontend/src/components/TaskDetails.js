import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { Button, Card, Form, Container, Row, Col } from 'react-bootstrap';

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
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

        fetchTask();
        fetchComments();
    }, [id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axiosInstance.post('comments/', {
                task: task.id,
                content: newComment
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setComments([...comments, response.data]);
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
        if (task.assigned_by.username !== currentUser) {
            setError('You did not create this task.');
            return;
        }
        navigate(`/edittask/${id}`);
    };

    if (!task) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-4">
            <Row className="justify-content-md-center">
                <Col md="8">
                    <Card>
                        <Card.Body>
                            <Card.Title>Task Details</Card.Title>
                            {error && <p className="text-danger">{error}</p>}
                            <div>
                                <h3>{task.title}</h3>
                                <p><strong>Description:</strong> {task.description}</p>
                                <p><strong>Assigned to:</strong> {task.user.username}</p>
                                <p><strong>Department:</strong> {task.department ? task.department.name : 'None'}</p>
                                <p><strong>Project:</strong> {task.project ? task.project.name : 'None'}</p>
                                <p><strong>Assigned by:</strong> {task.assigned_by.username}</p>
                            </div>
                            <Button variant="primary" onClick={handleEdit} className="me-2">Edit</Button>
                            <Button variant="danger" onClick={handleDelete}>Delete</Button>
                        </Card.Body>
                    </Card>
                    <Card className="mt-4">
                        <Card.Body>
                            <Card.Title>Comments</Card.Title>
                            {comments.map(comment => (
                                <Card key={comment.id} className="mb-2">
                                    <Card.Body>
                                        <p>{comment.content}</p>
                                        <footer className="blockquote-footer">
                                            By: {comment.user.username} on {new Date(comment.created_at).toLocaleString()}
                                        </footer>
                                    </Card.Body>
                                </Card>
                            ))}
                            <Form onSubmit={handleAddComment} className="mt-4">
                                <Form.Group controlId="comment">
                                    <Form.Label>Add a comment</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="mt-2">Add Comment</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TaskDetail;
