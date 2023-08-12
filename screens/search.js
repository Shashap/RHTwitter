const express = require('express');
const router = express.Router();
const { readUserData } = require('./persist');

// Search users based on the query parameter
router.get('/search', (req, res) => {
  const query = req.query.query;

  // Retrieve user data from persistence
  const usersData = readUserData();

  // Filter users based on the query
  console.info(query);
  const matchedUsers = usersData.filter(user => user.username.includes(query));

  res.json(matchedUsers);
});

module.exports = router;
