import React, { useState, useEffect } from 'react';
import { getTransactionHistory } from '../../services/rewardService';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactionHistory();
        console.log('Student transaction data:', data);
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transaction history');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div className="alert alert-info">Loading transactions...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (transactions.length === 0) return <div className="alert alert-warning">No transactions found. Try earning or redeeming some points!</div>;

  // Calculate total points
  const totalEarned = transactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.points, 0);
    
  const totalSpent = transactions
    .filter(t => t.type === 'spent')
    .reduce((sum, t) => sum + t.points, 0);

  const currentBalance = totalEarned - totalSpent;

  return (
    <div className="transaction-history">
      <div className="transaction-summary mb-4">
        <div className="row">
          <div className="col-md-4">
            <div className="card bg-light">
              <div className="card-body">
                <h5 className="card-title">Points Earned</h5>
                <p className="card-text h3 text-success">{totalEarned}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light">
              <div className="card-body">
                <h5 className="card-title">Points Spent</h5>
                <p className="card-text h3 text-primary">{totalSpent}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light">
              <div className="card-body">
                <h5 className="card-title">Current Balance</h5>
                <p className="card-text h3">{currentBalance}</p>
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
              <th>Type</th>
              <th>Points</th>
              <th>Description</th>
              <th>Original Price</th>
              <th>Discounted Price</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction._id}>
                <td>{new Date(transaction.date).toLocaleString()}</td>
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
    </div>
  );
};

export default TransactionHistory; 