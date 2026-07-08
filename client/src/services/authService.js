import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Set auth token in headers
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

// Register user
export const register = async (userData) => {
  console.log('Registering user with data:', { ...userData, password: '[HIDDEN]' });
  try {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    console.log('Registration API response:', res.data);
    
    const { token } = res.data;
    
    if (!token) {
      console.error('No token received from server');
      throw new Error('Authentication failed - no token received');
    }
    
    // Save token to localStorage
    localStorage.setItem('token', token);
    
    // Set token to axios headers
    setAuthToken(token);
    
    return res.data;
  } catch (err) {
    console.error('Registration error:', err);
    throw err;
  }
};

// Request OTP to verify email before creating account
export const requestOtp = async ({ name, email, role }) => {
  try {
    const res = await axios.post(`${API_URL}/auth/request-otp`, { name, email, role });
    return res.data;
  } catch (err) {
    console.error('requestOtp error:', err);
    throw err;
  }
};

// Verify OTP and create user with password
export const verifyOtp = async ({ name, email, otp, password, role }) => {
  try {
    const res = await axios.post(`${API_URL}/auth/verify-otp`, { name, email, otp, password, role });
    const { token } = res.data;
    if (!token) {
      throw new Error('Authentication failed - no token received');
    }
    localStorage.setItem('token', token);
    setAuthToken(token);
    return res.data;
  } catch (err) {
    console.error('verifyOtp error:', err);
    throw err;
  }
};

// Login user
export const login = async (email, password) => {
  console.log('Logging in user with email:', email);
  try {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    console.log('Login API response:', res.data);
    
    const { token } = res.data;
    
    if (!token) {
      console.error('No token received from server');
      throw new Error('Authentication failed - no token received');
    }
    
    // Save token to localStorage
    localStorage.setItem('token', token);
    
    // Set token to axios headers
    setAuthToken(token);
    
    return res.data;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
};

// Logout user
export const logout = () => {
  // Remove token from localStorage
  localStorage.removeItem('token');
  
  // Remove token from axios headers
  setAuthToken(null);
};

// Get current user data
export const getCurrentUser = async () => {
  try {
    const res = await axios.get(`${API_URL}/auth/user`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') ? true : false;
}; 