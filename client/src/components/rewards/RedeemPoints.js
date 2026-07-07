import React, { useState, useEffect } from 'react';
import { redeemPoints } from '../../services/rewardService';

const RedeemPoints = ({ onPointsRedeemed, currentPoints }) => {
  const [originalPrice, setOriginalPrice] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState(null);
  const [displayPoints, setDisplayPoints] = useState(0);

  // Ensure currentPoints is a valid number
  useEffect(() => {
    const validPoints = typeof currentPoints === 'number' && isFinite(currentPoints) 
      ? currentPoints 
      : 0;
    setDisplayPoints(validPoints);
    
    // Log points for debugging
    console.log('Current points (raw):', currentPoints);
    console.log('Display points (processed):', validPoints);
  }, [currentPoints]);

  const calculateDiscount = () => {
    if (!originalPrice || isNaN(originalPrice) || originalPrice <= 0) {
      return {
        discountAmount: 0,
        discountedPrice: 0,
        pointsNeeded: 0
      };
    }

    const price = parseFloat(originalPrice);
    const discountAmount = price * 0.1; // 10% discount
    const discountedPrice = price - discountAmount;
    const pointsNeeded = Math.ceil(discountAmount);

    return {
      discountAmount,
      discountedPrice,
      pointsNeeded
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResult(null);

    if (!originalPrice || isNaN(originalPrice) || originalPrice <= 0) {
      setError('Please enter a valid price');
      return;
    }

    if (!itemDescription.trim()) {
      setError('Please enter an item description');
      return;
    }

    const { pointsNeeded } = calculateDiscount();
    
    if (displayPoints < pointsNeeded) {
      setError(`You need ${pointsNeeded} points for this purchase but only have ${displayPoints}`);
      return;
    }

    try {
      setLoading(true);
      
      const data = await redeemPoints({
        originalPrice: parseFloat(originalPrice),
        itemDescription
      });
      
      setSuccess('Points redeemed successfully!');
      setResult(data);
      setOriginalPrice('');
      setItemDescription('');
      
      if (onPointsRedeemed) {
        onPointsRedeemed();
      }
    } catch (err) {
      console.error('Error redeeming points:', err);
      setError(err.response?.data?.msg || 'Failed to redeem points');
    } finally {
      setLoading(false);
    }
  };

  const { discountAmount, discountedPrice, pointsNeeded } = calculateDiscount();

  return (
    <div className="redeem-points">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="points-info mb-4">
        <h4>Your current points: <span className="badge bg-success">{displayPoints}</span></h4>
        <p className="text-muted">You can use your points for a 10% discount on purchases.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group mb-3">
          <label htmlFor="itemDescription" className="form-label">Item Description</label>
          <input
            type="text"
            id="itemDescription"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            className="form-control"
            placeholder="What are you purchasing?"
            required
          />
        </div>
        
        <div className="form-group mb-3">
          <label htmlFor="originalPrice" className="form-label">Original Price (₹)</label>
          <input
            type="number"
            id="originalPrice"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="form-control"
            placeholder="Enter original price"
            step="0.01"
            min="0.01"
            required
          />
        </div>
        
        {originalPrice && !isNaN(originalPrice) && originalPrice > 0 && (
          <div className="discount-preview card mb-4 p-3 bg-light">
            <h4 className="card-title">Discount Preview</h4>
            <div className="card-body p-0">
              <p>Original Price: <strong>₹{parseFloat(originalPrice).toFixed(2)}</strong></p>
              <p>Discount Amount (10%): <strong>₹{discountAmount.toFixed(2)}</strong></p>
              <p>Final Price: <strong>₹{discountedPrice.toFixed(2)}</strong></p>
              <p>Points Required: <strong>{pointsNeeded}</strong></p>
              
              {displayPoints < pointsNeeded && (
                <div className="alert alert-warning">
                  You need {pointsNeeded - displayPoints} more points for this discount
                </div>
              )}
            </div>
          </div>
        )}
        
        <button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={loading || !originalPrice || isNaN(originalPrice) || originalPrice <= 0 || displayPoints < pointsNeeded}
        >
          {loading ? 'Processing...' : 'Redeem Points'}
        </button>
      </form>
      
      {result && (
        <div className="redemption-result card border-success">
          <div className="card-header bg-success text-white">
            <h4 className="m-0">Redemption Successful!</h4>
          </div>
          <div className="card-body">
            <p>You spent <strong>{result.pointsSpent}</strong> points</p>
            <p>Original Price: <strong>₹{result.originalPrice.toFixed(2)}</strong></p>
            <p>Discounted Price: <strong>₹{result.discountedPrice.toFixed(2)}</strong></p>
            <p>You saved <strong>₹{(result.originalPrice - result.discountedPrice).toFixed(2)}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedeemPoints; 