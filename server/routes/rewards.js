const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const rewardController = require('../controllers/rewardController');

// Use memory storage on Vercel / serverless environments
const storage = multer.memoryStorage();

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG or PDF files are allowed'));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes for students
router.get('/points', auth, rewardController.getStudentRewards);
router.post('/request', [auth, upload.single('document')], rewardController.submitRewardRequest);
router.get('/request', auth, rewardController.getStudentRequests);
router.post('/redeem', auth, rewardController.redeemPoints);
router.get('/transactions', auth, rewardController.getTransactionHistory);
router.post('/reset-points', auth, rewardController.resetPoints);

// Routes for admins
router.get('/pending', [auth, admin], rewardController.getPendingRequests);
router.put('/review/:requestId', [auth, admin], rewardController.reviewRequest);

module.exports = router; 