import React, { useState, useEffect } from 'react';
import { getRewardRequests } from '../../services/rewardService';

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getRewardRequests();
        setRequests(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load request history');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'approved':
        return <span className="badge badge-success">Approved</span>;
      case 'rejected':
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge badge-secondary">Unknown</span>;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (requests.length === 0) return <div>No reward requests found.</div>;

  return (
    <div className="request-history">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Document</th>
            <th>Status</th>
            <th>Requested Points</th>
            <th>Approved Points</th>
            <th>Admin Notes</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request._id}>
              <td>{new Date(request.createdAt).toLocaleDateString()}</td>
              <td>
                <a 
                  href={`http://localhost:5000/${request.documentPath}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View Document
                </a>
              </td>
              <td>{getStatusBadge(request.status)}</td>
              <td>{request.requestedPoints || 'Not specified'}</td>
              <td>{request.status === 'approved' ? request.approvedPoints : '-'}</td>
              <td>{request.adminNotes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestHistory; 