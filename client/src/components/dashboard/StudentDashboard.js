import React, { useState, useEffect } from 'react';
import { getRewardPoints } from '../../services/rewardService';
import { getTransactionHistory } from '../../services/rewardService';
import RewardRequestForm from '../rewards/RewardRequestForm';
import RequestHistory from '../rewards/RequestHistory';
import TransactionHistory from '../rewards/TransactionHistory';
import RedeemPoints from '../rewards/RedeemPoints';

const StudentDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [rewardPoints, setRewardPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions to calculate balance
        const transactionData = await getTransactionHistory();
        setTransactions(transactionData);
        
        // Calculate balance from transactions
        const totalEarned = transactionData
          .filter(t => t.type === 'earned')
          .reduce((sum, t) => sum + t.points, 0);
          
        const totalSpent = transactionData
          .filter(t => t.type === 'spent')
          .reduce((sum, t) => sum + t.points, 0);
        
        const currentBalance = totalEarned - totalSpent;
        
        // Set the reward points to match the current balance
        console.log('Current balance from transactions:', currentBalance);
        setRewardPoints(currentBalance);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch data', err);
        setRewardPoints(0);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshPoints = async () => {
    try {
      // Fetch transactions to calculate updated balance
      const transactionData = await getTransactionHistory();
      setTransactions(transactionData);
      
      // Calculate balance from transactions
      const totalEarned = transactionData
        .filter(t => t.type === 'earned')
        .reduce((sum, t) => sum + t.points, 0);
        
      const totalSpent = transactionData
        .filter(t => t.type === 'spent')
        .reduce((sum, t) => sum + t.points, 0);
      
      const currentBalance = totalEarned - totalSpent;
      
      console.log('Updated balance from transactions:', currentBalance);
      setRewardPoints(currentBalance);
    } catch (err) {
      console.error('Failed to refresh points', err);
    }
  };

  // Format points for display
  const formattedPoints = loading 
    ? 'Loading...' 
    : rewardPoints.toString();

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h2>Student Dashboard</h2>
        <div className="reward-points-display">
          <div className="points-display" style={{ 
            fontSize: '1.3rem', 
            padding: '15px 25px',
            backgroundColor: '#28a745', 
            borderRadius: '8px',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            border: '2px solid #fff'
          }}>
            <span className="points-label">Your Reward Points:</span>
            <span className="points-value" style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              marginLeft: '15px',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              color: 'white'
            }}>
              {formattedPoints}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`tab-button ${activeTab === 'request' ? 'active' : ''}`}
          onClick={() => setActiveTab('request')}
        >
          Submit Request
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Request History
        </button>
        <button 
          className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button 
          className={`tab-button ${activeTab === 'redeem' ? 'active' : ''}`}
          onClick={() => setActiveTab('redeem')}
        >
          Redeem Points
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h3>Your Profile</h3>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Joined:</strong> {new Date(user.date).toLocaleDateString()}</p>
          </div>
        )}

        {activeTab === 'request' && (
          <div className="request-section">
            <h3>Submit Reward Request</h3>
            <RewardRequestForm onRequestSubmitted={refreshPoints} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <h3>Request History</h3>
            <RequestHistory />
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-section">
            <h3>Transaction History</h3>
            <TransactionHistory />
          </div>
        )}

        {activeTab === 'redeem' && (
          <div className="redeem-section">
            <h3>Redeem Points</h3>
            <RedeemPoints onPointsRedeemed={refreshPoints} currentPoints={rewardPoints} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard; 