const express = require('express');
const router = express.Router();
const { readUserData, readPostsData } = require('./persist');

// Middleware to check if the user is logged in
router.use((req, res, next) => {
  const { session } = req.cookies;
  if (!session || !session.username) {
    return res.status(401).json({ error: 'Unauthorized. Please log in first.' });
  }
  next();
});

// Endpoint to retrieve favorite posts
router.get('/favorites', (req, res) => {
  const { session } = req.cookies;
  const username = session.username;

  const usersData = readUserData();
  const postsData = readPostsData();

  const user = usersData.find(user => user.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const favoritePostIds = user.savedPosts || [];
  const favoritePosts = postsData.filter(post => favoritePostIds.includes(String(post.timestamp)));
  res.json(favoritePosts);
});

module.exports = router;

