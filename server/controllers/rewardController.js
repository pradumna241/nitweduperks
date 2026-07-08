const RewardPoint = require('../models/RewardPoint');
const RewardRequest = require('../models/RewardRequest');
const Transaction = require('../models/Transaction');

// Get student rewards
exports.getStudentRewards = async (req, res) => {
  try {
    let rewards = await RewardPoint.findOne({ student: req.user.id });
    
    if (!rewards) {
      // Create new reward record if not exists
      rewards = new RewardPoint({
        student: req.user.id,
        points: 0
      });
      await rewards.save();
    }
    
    // Ensure points is a valid number
    if (typeof rewards.points !== 'number' || isNaN(rewards.points) || !isFinite(rewards.points)) {
      console.warn(`Invalid points value detected for user ${req.user.id}: ${rewards.points}, resetting to 0`);
      rewards.points = 0;
      await rewards.save();
    }
    
    // Log the points being returned
    console.log(`Returning points for user ${req.user.id}: ${rewards.points}`);
    
    res.json(rewards);
  } catch (err) {
    console.error('Error in getStudentRewards:', err.message);
    res.status(500).send('Server Error');
  }
};

// Submit reward request
exports.submitRewardRequest = async (req, res) => {
  try {
    const { requestedPoints } = req.body;

    // With memory storage, multer stores file data in req.file.buffer.
    // Upload this buffer to a cloud storage service (e.g. Cloudinary, AWS S3)
    // and save the returned URL/path in your database instead of req.file.path.
    // Example:
    // const uploadedResult = await uploadToCloud(req.file.buffer, req.file.originalname);
    // const documentUrl = uploadedResult.secure_url || uploadedResult.Location;
    
    const newRequest = new RewardRequest({
      student: req.user.id,
      documentPath: req.file.originalname, // replace with cloud URL when saved
      requestedPoints: requestedPoints || 0
    });
    
    await newRequest.save();
    
    res.json({ msg: 'Reward request submitted successfully', request: newRequest });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get student's reward requests
exports.getStudentRequests = async (req, res) => {
  try {
    const requests = await RewardRequest.find({ student: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all pending requests (admin only)
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await RewardRequest.find({ status: 'pending' })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Review reward request (admin only)
exports.reviewRequest = async (req, res) => {
  try {
    const { status, approvedPoints, adminNotes } = req.body;
    const { requestId } = req.params;
    
    const request = await RewardRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }
    
    // Update request
    request.status = status;
    request.approvedPoints = approvedPoints;
    request.adminNotes = adminNotes;
    request.reviewedBy = req.user.id;
    request.reviewedAt = Date.now();
    
    await request.save();
    
    // If approved, add points to student's account
    if (status === 'approved' && approvedPoints > 0) {
      let rewards = await RewardPoint.findOne({ student: request.student });
      
      if (!rewards) {
        rewards = new RewardPoint({
          student: request.student,
          points: 0
        });
      }
      
      rewards.points += approvedPoints;
      rewards.lastUpdated = Date.now();
      
      await rewards.save();
      
      // Record transaction
      const transaction = new Transaction({
        student: request.student,
        type: 'earned',
        points: approvedPoints,
        description: 'Reward points approved by admin',
        rewardRequest: request._id
      });
      
      await transaction.save();
    }
    
    res.json({ msg: 'Request reviewed successfully', request });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get transaction history
exports.getTransactionHistory = async (req, res) => {
  try {
    // If admin requesting all transactions
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin && req.query.studentId 
      ? { student: req.query.studentId }
      : { student: req.user.id };
    
    console.log('Transaction query:', query); // Debug the query
    
    const transactions = await Transaction.find(query)
      .populate('student', 'name email') // Populate student data
      .sort({ date: -1 });
    
    console.log(`Found ${transactions.length} transactions`); // Debug transaction count
    
    res.json(transactions);
  } catch (err) {
    console.error('Error in getTransactionHistory:', err);
    res.status(500).send('Server Error');
  }
};

// Redeem points for purchase discount
exports.redeemPoints = async (req, res) => {
  try {
    const { originalPrice, itemDescription } = req.body;
    
    console.log('Redeeming points request:', req.body);
    
    if (!originalPrice || originalPrice <= 0) {
      return res.status(400).json({ msg: 'Valid price required' });
    }
    
    // Get student's current points
    const rewards = await RewardPoint.findOne({ student: req.user.id });
    
    if (!rewards) {
      return res.status(400).json({ msg: 'No reward points found' });
    }
    
    console.log('Current student points:', rewards.points);
    
    // Calculate 10% discount
    const discountAmount = originalPrice * 0.1;
    const pointsNeeded = Math.ceil(discountAmount);
    
    console.log('Points needed for discount:', pointsNeeded);
    
    if (rewards.points < pointsNeeded) {
      return res.status(400).json({ 
        msg: 'Insufficient points', 
        pointsAvailable: rewards.points,
        pointsNeeded
      });
    }
    
    // Update points
    rewards.points -= pointsNeeded;
    rewards.lastUpdated = Date.now();
    
    console.log('Updated points balance:', rewards.points);
    
    await rewards.save();
    
    // Calculate discounted price
    const discountedPrice = originalPrice - discountAmount;
    
    // Record transaction
    const transaction = new Transaction({
      student: req.user.id,
      type: 'spent',
      points: pointsNeeded,
      description: `Points redeemed for discount on ${itemDescription}`,
      originalPrice,
      discountedPrice
    });
    
    await transaction.save();
    console.log('Transaction recorded:', transaction);
    
    res.json({
      msg: 'Points redeemed successfully',
      pointsSpent: pointsNeeded,
      originalPrice,
      discountedPrice,
      remainingPoints: rewards.points,
      transaction
    });
  } catch (err) {
    console.error('Error in redeemPoints:', err);
    res.status(500).send('Server Error');
  }
};

// Reset points (in case of corruption)
exports.resetPoints = async (req, res) => {
  try {
    const rewards = await RewardPoint.findOne({ student: req.user.id });
    
    if (!rewards) {
      // Create new record if it doesn't exist
      const newRewards = new RewardPoint({
        student: req.user.id,
        points: 0
      });
      await newRewards.save();
      return res.json({ msg: 'Points reset to 0', points: 0 });
    }
    
    // Check if points are valid
    const oldPoints = rewards.points;
    
    // Reset to a valid points value if needed
    if (typeof oldPoints !== 'number' || isNaN(oldPoints) || !isFinite(oldPoints) || oldPoints > 1000000) {
      rewards.points = 0;
      await rewards.save();
      console.log(`Reset corrupted points value ${oldPoints} to 0 for user ${req.user.id}`);
      return res.json({ 
        msg: 'Corrupted points value reset to 0', 
        oldPoints, 
        newPoints: 0 
      });
    }
    
    return res.json({ 
      msg: 'Points appear to be valid, no reset needed', 
      points: rewards.points 
    });
  } catch (err) {
    console.error('Error in resetPoints:', err);
    res.status(500).send('Server Error');
  }
}; 