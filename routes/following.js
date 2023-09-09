const express = require('express');
const cookieParser = require('cookie-parser');

const router = express.Router();
const { readUserData, saveUserData } = require('./persist');

router.get('/following/:username', (req, res) => {
  const { username } = req.params;
  const usersData = readUserData();
  const user = usersData.find((u) => u.username === username);

  if (!user) {
    res.status(404).json({ error: 'User not found.' });
  } else {
    const followingUsers = user.following.map((followedUsername) =>
      usersData.find((u) => u.username === followedUsername)
    );
    res.json(followingUsers);
  }
});

// Follow a user
router.post('/follow/:username', (req, res) => {
  const { username } = req.params;
  const followerUsername = req.cookies.session.username;
  const usersData = readUserData();

  const user = usersData.find((u) => u.username === username);
  const follower = usersData.find((u) => u.username === followerUsername);

  if (!user || !follower) {
    res.status(404).json({ error: 'User not found.' });
  } else {
    if (!user.followers.includes(followerUsername)) {
      user.followers.push(followerUsername);
      follower.following.push(username);
      saveUserData(usersData);
    }
    res.json(user);
  }
});

// Unfollow a user
router.post('/unfollow/:username', (req, res) => {
  const { username } = req.params;
  const followerUsername = req.cookies.session.username;
  const usersData = readUserData();

  const user = usersData.find((u) => u.username === username);
  const follower = usersData.find((u) => u.username === followerUsername);

  if (!user || !follower) {
    res.status(404).json({ error: 'User not found.' });
  } else {
    user.followers = user.followers.filter((follower) => follower !== followerUsername);
    follower.following = follower.following.filter((followed) => followed !== username);
    saveUserData(usersData);
    res.json(user);
  }
});

module.exports = router;
