const express = require('express');
const router = express.Router();
const { readUserData, readPostsData} = require('./persist');

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

// Search posts based on the query parameter
router.get('/searchPosts', (req, res) => {
  const query = req.query.query;
  const { session } = req.cookies;
  const username = session.username;

  const usersData = readUserData();
  const postsData = readPostsData();

  const user = usersData.find((user) => user.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  // Filter users based on the query
  console.info(query);
  const matchedPosts = postsData.filter(post => post.text.includes(query));

  const postsWithUserLikes = matchedPosts.map(post => ({
    ...post,
    editor: post.username,
    userHasLiked: post.likedUsers.includes(username),
    userHasSaved: user.savedPosts.includes(post.timestamp.toString()),
  }));

  res.json(postsWithUserLikes);
});

module.exports = router;
