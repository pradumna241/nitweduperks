import React, { useState } from 'react';
import { submitRewardRequest } from '../../services/rewardService';

const RewardRequestForm = ({ onRequestSubmitted }) => {
  const [file, setFile] = useState(null);
  const [requestedPoints, setRequestedPoints] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('document', file);
      formData.append('requestedPoints', requestedPoints);
      formData.append('description', description);
      
      await submitRewardRequest(formData);
      
      setSuccess('Request submitted successfully');
      setFile(null);
      setRequestedPoints('');
      setDescription('');
      
      if (onRequestSubmitted) {
        onRequestSubmitted();
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reward-request-form">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="document">Upload Certificate/Document (JPG, PNG, PDF only)</label>
          <input
            type="file"
            id="document"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            className="form-control"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description of Achievement</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            placeholder="Briefly describe your achievement"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="requestedPoints">Requested Points (optional)</label>
          <input
            type="number"
            id="requestedPoints"
            value={requestedPoints}
            onChange={(e) => setRequestedPoints(e.target.value)}
            className="form-control"
            placeholder="How many points do you think this achievement deserves?"
            min="0"
          />
          <small className="form-text text-muted">
            This is just a suggestion. The admin will decide the final points.
          </small>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default RewardRequestForm; 