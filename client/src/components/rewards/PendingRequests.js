import React, { useState, useEffect } from 'react';
import { getPendingRequests, reviewRequest } from '../../services/rewardService';

const API_HOST = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/api$/, '') : 'http://localhost:5000';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reviewingRequest, setReviewingRequest] = useState(null);
  const [approvedPoints, setApprovedPoints] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const data = await getPendingRequests();
      setRequests(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load pending requests');
      setLoading(false);
    }
  };

  const handleReviewClick = (request) => {
    setReviewingRequest(request);
    setApprovedPoints('');
    setAdminNotes('');
  };

  const handlePreviewClick = (request) => {
    setPreviewDocument(request);
  };

  const closePreview = () => {
    setPreviewDocument(null);
  };

  const handleReviewSubmit = async (status) => {
    if (status === 'approved' && (!approvedPoints || approvedPoints <= 0)) {
      setError('Please enter a valid number of points to approve');
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      setSuccess('');

      await reviewRequest(reviewingRequest._id, {
        status,
        approvedPoints: status === 'approved' ? approvedPoints : 0,
        adminNotes
      });

      setSuccess(`Request ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      setReviewingRequest(null);
      fetchPendingRequests();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to process request');
    } finally {
      setActionLoading(false);
    }
  };

  const getDocumentExtension = (path) => {
    if (!path) return '';
    return path.split('.').pop().toLowerCase();
  };

  const renderDocumentPreview = (request) => {
    const docPath = `${API_HOST}/${request.documentPath}`;
    const extension = getDocumentExtension(request.documentPath);
    
    if (['jpg', 'jpeg', 'png'].includes(extension)) {
      return (
        <div className="document-preview-image">
          <img src={docPath} alt="Certificate" className="img-fluid" />
        </div>
      );
    } else if (extension === 'pdf') {
      return (
        <div className="document-preview-pdf">
          <iframe 
            src={`${docPath}#toolbar=0&navpanes=0`} 
            title="PDF Document" 
            width="100%" 
            height="500px"
          />
        </div>
      );
    } else {
      return (
        <div className="document-preview-unsupported">
          <p>Preview not supported for this file type.</p>
          <a 
            href={docPath} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Download Document
          </a>
        </div>
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (requests.length === 0) return <div>No pending requests found.</div>;

  return (
    <div className="pending-requests">
      {success && <div className="alert alert-success">{success}</div>}
      
      {previewDocument && (
        <div className="document-modal">
          <div className="document-modal-content">
            <div className="document-modal-header">
              <h4>Document Preview</h4>
              <button 
                onClick={closePreview} 
                className="close-button"
              >
                &times;
              </button>
            </div>
            <div className="document-modal-body">
              <div className="document-info">
                <p><strong>Student:</strong> {previewDocument.student.name}</p>
                <p><strong>Submitted:</strong> {new Date(previewDocument.createdAt).toLocaleString()}</p>
                <p><strong>File Type:</strong> {getDocumentExtension(previewDocument.documentPath).toUpperCase()}</p>
              </div>
              {renderDocumentPreview(previewDocument)}
            </div>
            <div className="document-modal-footer">
              <button 
                onClick={() => {
                  handleReviewClick(previewDocument);
                  closePreview();
                }} 
                className="btn btn-primary"
              >
                Review This Request
              </button>
              <button 
                onClick={closePreview} 
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {reviewingRequest ? (
        <div className="review-form">
          <h4>Review Request</h4>
          <div className="request-details">
            <p><strong>Student:</strong> {reviewingRequest.student.name} ({reviewingRequest.student.email})</p>
            <p><strong>Submitted:</strong> {new Date(reviewingRequest.createdAt).toLocaleString()}</p>
            <p><strong>Requested Points:</strong> {reviewingRequest.requestedPoints || 'Not specified'}</p>
            <p>
              <strong>Document:</strong>{' '}
              <button 
                onClick={() => handlePreviewClick(reviewingRequest)} 
                className="btn btn-link p-0"
              >
                Preview Document
              </button>{' '}
              <a 
                href={`${API_HOST}/${reviewingRequest.documentPath}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                (Download)
              </a>
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="approvedPoints">Approved Points</label>
            <input
              type="number"
              id="approvedPoints"
              value={approvedPoints}
              onChange={(e) => setApprovedPoints(e.target.value)}
              className="form-control"
              min="1"
              required={true}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="adminNotes">Admin Notes</label>
            <textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="form-control"
              placeholder="Optional notes for the student"
            />
          </div>
          
          <div className="button-group">
            <button 
              onClick={() => handleReviewSubmit('approved')}
              className="btn btn-success"
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Approve'}
            </button>
            <button 
              onClick={() => handleReviewSubmit('rejected')}
              className="btn btn-danger"
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Reject'}
            </button>
            <button 
              onClick={() => setReviewingRequest(null)}
              className="btn btn-secondary"
              disabled={actionLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Student</th>
              <th>Document</th>
              <th>Requested Points</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request._id}>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                <td>{request.student.name} ({request.student.email})</td>
                <td>
                  <button 
                    onClick={() => handlePreviewClick(request)} 
                    className="btn btn-link p-0"
                  >
                    Preview
                  </button>{' | '}
                  <a 
                    href={`${API_HOST}/${request.documentPath}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </td>
                <td>{request.requestedPoints || 'Not specified'}</td>
                <td>
                  <button 
                    onClick={() => handleReviewClick(request)}
                    className="btn btn-primary btn-sm"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingRequests; 