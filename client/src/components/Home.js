import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserGraduate, FaUserShield, FaTrophy } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-header">
        <div className="home-logo">
          <FaTrophy className="home-logo-icon" />
          <h1>Welcome to NITW EduPerks</h1>
        </div>
        <p>
          NITW EduPerks is a platform designed to recognize and reward student achievements
          across various academic and extracurricular activities.
        </p>
      </div>
      
      <div className="login-options">
        <div className="login-card">
          <FaUserGraduate className="login-icon" />
          <h2>Student Login</h2>
          <p>Access your student account to view rewards, achievements, and progress.</p>
          <Link to="/login" className="login-btn">Student Login</Link>
        </div>
        
        <div className="login-card">
          <FaUserShield className="login-icon" />
          <h2>Admin Login</h2>
          <p>Access administrative features to manage students, rewards, and system settings.</p>
          <Link to="/admin/login" className="login-btn admin">Admin Login</Link>
          <Link to="/admin/register" className="login-btn admin-register">Register Admin</Link>
        </div>
      </div>
      
      <div className="home-footer">
        <p>&copy; {new Date().getFullYear()} NITW EduPerks. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Home; 