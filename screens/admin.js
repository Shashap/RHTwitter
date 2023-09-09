// admin.js
const express = require('express');
const router = express.Router();
const {
  readUserData,
  readPostsData,
  saveUserData,
  savePostsData,
  readConfigData,
  saveConfigData
} = require('./persist');

// Get all user activity (login/logout/post new story)
router.get('/activity', (req, res) => {
  const usersData = readUserData();
  const postsData = readPostsData();

  const activityLogs = usersData.map((user) => {
    return {
      username: user.username,
      activityHistory: user.activityHistory,
      posts: postsData.filter((post) => post.username === user.username),
    };
  });

  res.json(activityLogs);
});

// get all users
router.get('/users', (req, res) => {
  const usersData = readUserData();

  const users = usersData.map((user) => {
    return {username: user.username};
  });

  res.json(users);
});

router.post('/users/delete', (req, res) => {
  const { usersToDelete } = req.body;
  const usersData = readUserData();
  const postsData = readPostsData();

  // Remove selected users' posts from postsData
  const filteredPosts = postsData.filter((post) => !usersToDelete.includes(post.username));
  savePostsData(filteredPosts);

  // Remove selected users from usersData
  const remainingUsers = usersData.filter((user) => !usersToDelete.includes(user.username));
  saveUserData(remainingUsers);

  res.json({ message: 'Selected users removed successfully.' });
});


router.post('/features', (req, res) => {
  const { feedFilter, feedSort, favorites, searchPosts } = req.body;
  try {
    const config = readConfigData();

    // Update the feature statuses in the config
    config.features.feedFilter = feedFilter;
    config.features.feedSort = feedSort;
    config.features.favorites = favorites;
    config.features.searchPosts = searchPosts;
    saveConfigData(config);

    res.json({ message: 'Feature status updated successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/config', (req, res) => {
  try {
    const config = readConfigData();
    res.json(config);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
