const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rewards', require('./routes/rewards'));

// Home route
app.get('/', (req, res) => {
  res.send('Student Reward Management System API');
});

// Protected route example
const auth = require('./middleware/auth');
app.get('/api/protected', auth, (req, res) => {
  res.json({ msg: 'This is a protected route', user: req.user });
});

// Admin-only route example
const admin = require('./middleware/admin');
app.get('/api/admin', [auth, admin], (req, res) => {
  res.json({ msg: 'This is an admin-only route' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; 