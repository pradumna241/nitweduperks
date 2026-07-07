import React, { useState } from 'react';
import { login } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserGraduate } from 'react-icons/fa';
import '../../styles/Auth.css';
import Logo from '../common/Logo';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { email });
      const response = await login(email, password);
      console.log('Login successful:', response);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response) {
        console.error('Server response:', err.response.data);
        errorMessage = err.response.data.msg || errorMessage;
        
        // Handle specific error cases
        if (err.response.status === 400) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (err.request) {
        // Request was made but no response received
        console.error('No response received:', err.request);
        errorMessage = 'No response from server. Please check your internet connection.';
      } else {
        // Other errors
        console.error('Error message:', err.message);
      }
      
      setError(errorMessage);
      setLoading(false);
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
            <FaUserGraduate className="auth-icon" style={{ color: '#007bff' }} />
            <h2>Student Login</h2>
            <p>Access your NITW EduPerks account</p>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email"
                name="email" 
                value={email} 
                onChange={onChange} 
                required 
                placeholder="Enter your email"
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
                placeholder="Enter your password"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Register</Link></p>
            <p>Back to <Link to="/">Home</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 