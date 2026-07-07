import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTransactionHistory } from '../../services/rewardService'; // Import the service function

const AdminTransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentFilter, setStudentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (studentId = '') => {
    setLoading(true);
    setError('');
    try {
      // Use the service function instead of direct axios call to ensure proper auth headers
      const data = await getTransactionHistory(studentId);
      console.log('Transactions response:', data);
      
      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        console.error('Response is not an array:', data);
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(`Failed to load transaction history: ${err.response?.data?.msg || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentFilterChange = (e) => {
    setStudentFilter(e.target.value);
  };

  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Apply type filter
    if (typeFilter !== 'all' && transaction.type !== typeFilter) {
      return false;
    }
    
    return true;
  });

  // Calculate totals
  const totalEarned = transactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.points, 0);
    
  const totalSpent = transactions
    .filter(t => t.type === 'spent')
    .reduce((sum, t) => sum + t.points, 0);

  return (
    <div className="admin-transaction-history">
      <div className="filters mb-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="typeFilter" className="form-label">Filter by Type:</label>
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={handleTypeFilterChange}
              className="form-select"
            >
              <option value="all">All Transactions</option>
              <option value="earned">Earned Points</option>
              <option value="spent">Spent Points</option>
            </select>
          </div>
          
          <div className="col-md-6 mb-3">
            <label htmlFor="studentFilter" className="form-label">Student ID:</label>
            <div className="input-group">
              <input
                type="text"
                id="studentFilter"
                value={studentFilter}
                onChange={handleStudentFilterChange}
                className="form-control"
                placeholder="Enter student ID"
              />
              <button 
                onClick={() => fetchTransactions(studentFilter)}
                className="btn btn-primary"
              >
                Filter
              </button>
              <button 
                onClick={() => {
                  setStudentFilter('');
                  fetchTransactions('');
                }}
                className="btn btn-secondary"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && <div className="alert alert-info">Loading transactions...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {!loading && !error && transactions.length === 0 && (
        <div className="alert alert-warning">
          No transactions found. Try creating some reward requests or redeeming points.
        </div>
      )}
      
      {!loading && !error && transactions.length > 0 && (
        <>
          <div className="transaction-summary mb-4">
            <div className="row">
              <div className="col-md-4">
                <div className="card bg-light">
                  <div className="card-body">
                    <h5 className="card-title">Total Transactions</h5>
                    <p className="card-text h3">{transactions.length}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <h5 className="card-title">Total Points Earned</h5>
                    <p className="card-text h3">{totalEarned}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <h5 className="card-title">Total Points Spent</h5>
                    <p className="card-text h3">{totalSpent}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Date</th>
                  <th>Student ID</th>
                  <th>Type</th>
                  <th>Points</th>
                  <th>Description</th>
                  <th>Original Price</th>
                  <th>Discounted Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr key={transaction._id || Math.random().toString()}>
                    <td>{new Date(transaction.date).toLocaleString()}</td>
                    <td>
                      {/* Handle ObjectId appropriately */}
                      {typeof transaction.student === 'object' 
                        ? transaction.student.name || transaction.student._id 
                        : transaction.student}
                    </td>
                    <td>
                      <span className={`badge ${transaction.type === 'earned' ? 'bg-success' : 'bg-primary'}`}>
                        {transaction.type === 'earned' ? 'Earned' : 'Spent'}
                      </span>
                    </td>
                    <td>{transaction.points}</td>
                    <td>{transaction.description}</td>
                    <td>
                      {transaction.originalPrice 
                        ? `₹${transaction.originalPrice.toFixed(2)}` 
                        : '-'}
                    </td>
                    <td>
                      {transaction.discountedPrice 
                        ? `₹${transaction.discountedPrice.toFixed(2)}` 
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminTransactionHistory; 