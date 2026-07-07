import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1>Student Reward Management System</h1>
          <p className="lead">Manage and track student achievements and rewards</p>
        </div>
        
        <div className="login-options">
          <div className="login-option student">
            <div className="option-icon">
              <i className="fas fa-user-graduate"></i>
            </div>
            <h2>Student Login</h2>
            <p>Submit reward requests, view your rewards and redeem points</p>
            <Link to="/login?role=student" className="btn btn-primary btn-lg">
              Student Login
            </Link>
          </div>
          
          <div className="login-option admin">
            <div className="option-icon">
              <i className="fas fa-user-shield"></i>
            </div>
            <h2>Admin Login</h2>
            <p>Review requests, manage rewards and generate reports</p>
            <Link to="/login?role=admin" className="btn btn-danger btn-lg">
              Admin Login
            </Link>
          </div>
        </div>
        
        <div className="home-footer">
          <p>New student? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Home; 