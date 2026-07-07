import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';
import axios from 'axios';
import { setAuthToken } from '../../services/authService';
import '../../styles/Auth.css';
import Logo from '../common/Logo';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await axios.post('/api/auth/admin/login', formData);
      
      // Save token to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userType', 'admin');
      
      // Set token to Auth header
      setAuthToken(res.data.token);
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      width: '100%', 
      minHeight: '100vh' 
    }}>
      <Logo />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <FaUserShield className="auth-icon" />
            <h2>Admin Login</h2>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          
          <div className="auth-footer">
            <p>Need an admin account? <a href="/admin/register">Register here</a></p>
            <p>Back to <a href="/">Home</a></p>
            <p>Access administrative features of NITW EduPerks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 