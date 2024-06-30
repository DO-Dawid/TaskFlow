import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'; // Import custom styles for additional design

const Home = () => {
    return (
        <div className="home-container">
            <div className="banner">
                <div className="banner-text">
                    <h2>Welcome to TaskFlow</h2>
                    <p className="lead">Your task management solution.</p>
                </div>
            </div>
            <div className="container mt-5 text-center">
                <div className="row mt-5">
                    <div className="col-md-4">
                        <h3>Task Management</h3>
                        <p>Track tasks, collaborate with team members, and achieve your goals.</p>
                    </div>
                    <div className="col-md-4">
                        <h3>Features</h3>
                        <p>Comprehensive tools to stay organized and manage your projects effectively.</p>
                    </div>
                    <div className="col-md-4">
                        <h3>Productivity</h3>
                        <p>Enhance productivity with effective task tracking and project management.</p>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-md-6">
                        <img src="/task_screenshot1.jpg" alt="TaskFlow Screenshot 1" className="img-fluid" />
                    </div>
                    <div className="col-md-6">
                        <img src="/task_screenshot2.jpg" alt="TaskFlow Screenshot 2" className="img-fluid" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
