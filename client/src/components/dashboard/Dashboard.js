import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import Logo from '../common/Logo';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/user');
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="app-header">
        <div className="header-logo">
          <Logo />
        </div>
        <h1>NITW EduPerks</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <main>
        {user && user.role === 'admin' ? (
          <AdminDashboard user={user} />
        ) : (
          <StudentDashboard user={user} />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} NITW EduPerks. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard; 