import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get student reward points
export const getRewardPoints = async () => {
  try {
    const res = await axios.get(`${API_URL}/rewards/points`);
    console.log('Raw reward points response:', res.data);
    
    // Validate the response data
    if (!res.data || typeof res.data !== 'object') {
      console.error('Invalid response format from API:', res.data);
      return { points: 0 };
    }
    
    // Ensure points is a number
    const points = parseInt(res.data.points, 10) || 0;
    
    return { 
      ...res.data,
      points: isFinite(points) ? points : 0 
    };
  } catch (err) {
    console.error('Error getting reward points:', err);
    throw err;
  }
};

// Submit reward request with document upload
export const submitRewardRequest = async (formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    const res = await axios.post(`${API_URL}/rewards/request`, formData, config);
    return res.data;
  } catch (err) {
    console.error('Error submitting reward request:', err);
    throw err;
  }
};

// Get student's reward requests
export const getRewardRequests = async () => {
  try {
    const res = await axios.get(`${API_URL}/rewards/request`);
    return res.data;
  } catch (err) {
    console.error('Error getting reward requests:', err);
    throw err;
  }
};

// Get transaction history
export const getTransactionHistory = async (studentId = '') => {
  try {
    let url = `${API_URL}/rewards/transactions`;
    
    // Add studentId as query parameter if provided
    if (studentId) {
      url += `?studentId=${studentId}`;
    }
    
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error('Error getting transaction history:', err);
    throw err;
  }
};

// Redeem points
export const redeemPoints = async (redeemData) => {
  try {
    const res = await axios.post(`${API_URL}/rewards/redeem`, redeemData);
    return res.data;
  } catch (err) {
    console.error('Error redeeming points:', err);
    throw err;
  }
};

// ADMIN FUNCTIONS

// Get pending requests (admin only)
export const getPendingRequests = async () => {
  try {
    const res = await axios.get(`${API_URL}/rewards/pending`);
    return res.data;
  } catch (err) {
    console.error('Error getting pending requests:', err);
    throw err;
  }
};

// Review reward request (admin only)
export const reviewRequest = async (requestId, reviewData) => {
  try {
    const res = await axios.put(`${API_URL}/rewards/review/${requestId}`, reviewData);
    return res.data;
  } catch (err) {
    console.error('Error reviewing request:', err);
    throw err;
  }
};

// Reset points (if corrupted)
export const resetPoints = async () => {
  try {
    const res = await axios.post(`${API_URL}/rewards/reset-points`);
    console.log('Points reset response:', res.data);
    return res.data;
  } catch (err) {
    console.error('Error resetting points:', err);
    throw err;
  }
}; 