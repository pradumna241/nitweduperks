import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';
import { requestOtp, verifyOtp } from '../../services/authService';
import { setAuthToken } from '../../services/authService';
import '../../styles/Auth.css';
import Logo from '../common/Logo';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [otpData, setOtpData] = useState({ otp: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('enter');

  const { name, email } = formData;
  const { otp, password, password2 } = otpData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onOtpChange = e => {
    setOtpData({ ...otpData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await requestOtp({ name, email, role: 'admin' });
      setStage('otp');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.msg || 'Failed to send OTP');
    }
  };

  const onVerify = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (password !== password2) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await verifyOtp({ name, email, otp, password, role: 'admin' });
      localStorage.setItem('userType', 'admin');
      setAuthToken(res.token || localStorage.getItem('token'));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Verification failed');
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
            <FaUserShield className="auth-icon" />
            <h2>Admin Registration</h2>
            <p>Create a new administrator account</p>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          {stage === 'enter' && (
            <form className="auth-form" onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                />
              </div>

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

              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sending OTP...' : 'Send OTP'}</button>
            </form>
          )}

          {stage === 'otp' && (
            <form className="auth-form" onSubmit={onVerify}>
              <div className="form-group">
                <label htmlFor="otp">OTP</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={onOtpChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Create Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onOtpChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password2">Confirm Password</label>
                <input
                  type="password"
                  id="password2"
                  name="password2"
                  value={password2}
                  onChange={onOtpChange}
                  required
                  minLength="6"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Verifying...' : 'Verify & Create Account'}</button>
            </form>
          )}
          
          <div className="auth-footer">
            <p>Already have an account? <a href="/admin/login">Login</a></p>
            <p>Back to <a href="/">Home</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister; 