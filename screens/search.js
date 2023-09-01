const express = require('express');
const router = express.Router();
const { readUserData } = require('./persist');

// Middleware to check if the user is logged in
router.use((req, res, next) => {
  const { session } = req.cookies;
  if (!session || !session.username) {
    return res.status(401).json({ error: 'Unauthorized. Please log in first.' });
  }
  next();
});

// Search users based on the query parameter
router.get('/search', (req, res) => {
  const query = req.query.query;

  // Retrieve user data from persistence
  const usersData = readUserData();

  // Filter users based on the query
  const matchedUsers = usersData.filter(user => user.username.startsWith(query));

  res.json(matchedUsers);
});

module.exports = router;
