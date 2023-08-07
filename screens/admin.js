// admin.js
const express = require('express');
const router = express.Router();
const { readUserData, readPostsData, saveUserData, savePostsData } = require('./persist');

// Get all user activity (login/logout/post new story)
router.get('/activity', (req, res) => {
  const usersData = readUserData();
  const postsData = readPostsData();

  const activityLogs = usersData.map((user) => {
    const userActivity = {
      username: user.username,
      loginActivity: user.loginActivity,
      logoutActivity: user.logoutActivity,
      posts: postsData.filter((post) => post.username === user.username),
    };
    return userActivity;
  });

  res.json(activityLogs);
});

// Enable/disable additional features/pages
router.post('/features', (req, res) => {
  const { feature, enabled } = req.body;

  // Implement feature enabling/disabling logic here
  // For example, you can update a configuration file or database to store the state of features.

  res.json({ message: 'Feature status updated successfully.' });
});

// Remove a user from the social network
router.delete('/users/:username', (req, res) => {
  const { username } = req.params;
  const usersData = readUserData();
  const postsData = readPostsData();

  const userIndex = usersData.findIndex((user) => user.username === username);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  // Remove user's posts from postsData
  const filteredPosts = postsData.filter((post) => post.username !== username);
  savePostsData(filteredPosts);

  // Remove user from usersData
  usersData.splice(userIndex, 1);
  saveUserData(usersData);

  res.json({ message: 'User removed successfully.' });
});

module.exports = router;
