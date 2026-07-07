import React, { useState } from 'react';
import { requestOtp, verifyOtp } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserGraduate } from 'react-icons/fa';
import '../../styles/Auth.css';
import Logo from '../common/Logo';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', role: 'student' });
  const [otpData, setOtpData] = useState({ otp: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('enter'); // enter -> otp

  const { name, email, role } = formData;
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
      await requestOtp({ name, email, role });
      setStage('otp');
      setLoading(false);
    } catch (err) {
      console.error('Request OTP error:', err);
      let errorMessage = 'Failed to send OTP. Please try again.';
      if (err.response && err.response.data) errorMessage = err.response.data.msg || errorMessage;
      setError(errorMessage);
      setLoading(false);
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
      await verifyOtp({ name, email, otp, password, role });
      navigate('/dashboard');
    } catch (err) {
      console.error('Verify OTP error:', err);
      let errorMessage = 'Failed to verify OTP. Please try again.';
      if (err.response && err.response.data) errorMessage = err.response.data.msg || errorMessage;
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
            <h2>Student Registration</h2>
            <p>Create your NITW EduPerks account to track your achievements and rewards.</p>
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
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email"
                  id="email" 
                  name="email" 
                  value={email} 
                  onChange={onChange} 
                  required 
                />
              </div>

              <input type="hidden" name="role" value="student" />
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Register'}
              </button>
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
                  minLength="6" 
                  required 
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
                  minLength="6" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify & Register'}
              </button>

              <div style={{ marginTop: '10px' }}>
                <button type="button" className="btn btn-link" onClick={async () => {
                  setError('');
                  setLoading(true);
                  try {
                    await requestOtp({ name, email, role });
                    setLoading(false);
                  } catch (err) {
                    setLoading(false);
                    setError('Failed to resend OTP');
                  }
                }}>Resend OTP</button>
              </div>
            </form>
          )}
          
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Login</Link></p>
            <p>Back to <Link to="/">Home</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 