/**
 * Seed script for Student Reward System
 * Run with: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const RewardPoint = require('./models/RewardPoint');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const seedTransactions = async () => {
  try {
    // Check if we already have transactions
    const existingTransactions = await Transaction.countDocuments();
    
    if (existingTransactions > 0) {
      console.log(`Database already contains ${existingTransactions} transactions. Skipping seed.`);
      return;
    }
    
    // Get all users
    const users = await User.find();
    
    if (users.length === 0) {
      console.log('No users found. Please create users first.');
      return;
    }
    
    // Find student users
    const students = users.filter(user => user.role === 'student');
    
    if (students.length === 0) {
      console.log('No student users found. Please create student users first.');
      return;
    }
    
    // Create test transactions
    const transactions = [];
    
    for (const student of students) {
      // Create RewardPoint record if it doesn't exist
      let rewardPoint = await RewardPoint.findOne({ student: student._id });
      
      if (!rewardPoint) {
        rewardPoint = new RewardPoint({
          student: student._id,
          points: 0
        });
      }
      
      // Add earned transactions
      transactions.push({
        student: student._id,
        type: 'earned',
        points: 100,
        description: 'Initial reward points',
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
      
      transactions.push({
        student: student._id,
        type: 'earned',
        points: 50,
        description: 'Completed project assignment',
        date: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000)
      });
      
      // Add spent transactions
      transactions.push({
        student: student._id,
        type: 'spent',
        points: 30,
        description: 'Redeemed for textbook discount',
        originalPrice: 59.99,
        discountedPrice: 53.99,
        date: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000)
      });
      
      // Update reward points
      rewardPoint.points = 120; // 100 + 50 - 30
      await rewardPoint.save();
      
      console.log(`Added test transactions for student: ${student.name}`);
    }
    
    // Insert all transactions
    await Transaction.insertMany(transactions);
    
    console.log(`Successfully added ${transactions.length} test transactions`);
  } catch (err) {
    console.error('Error seeding transactions:', err);
  }
};

seedTransactions().then(() => {
  console.log('Seed completed');
  mongoose.connection.close();
}); 