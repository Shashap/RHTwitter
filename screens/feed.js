// feed.js
const express = require('express');
const router = express.Router();
const { readUserData, readPostsData, savePostsData } = require('./persist');

// Middleware to check if the user is logged in
router.use((req, res, next) => {
  const { session } = req.cookies;
  if (!session || !session.username) {
    return res.status(401).json({ error: 'Unauthorized. Please log in first.' });
  }
  next();
});

// Get all posts made by the user and the users they follow
router.get('/feed', (req, res) => {
  const { session } = req.cookies;
  const username = session.username;

  const usersData = readUserData();
  const postsData = readPostsData();

  const user = usersData.find((user) => user.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const postsWithUserLikes = postsData.map(post => ({
    ...post,
    userHasLiked: post.likedUsers.includes(username),
  }));

  res.json(postsWithUserLikes);
});

// Like a post
router.post('/feed/like/:postId', (req, res) => {
  const { session } = req.cookies;
  const username = session.username;
  const { postId } = req.params;

  const usersData = readUserData();
  const postsData = readPostsData();

  const user = usersData.find((user) => user.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const post = postsData.find((post) => post.timestamp === parseInt(postId));
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  if (!post.likedUsers.includes(username)) {
    post.likes += 1;
    post.likedUsers.push(username);
    savePostsData(postsData);
  }

  res.json({ message: 'Post liked successfully.', likes: post.likes });
});


// Unlike a post
router.delete('/feed/like/:postId', (req, res) => {
  const { session } = req.cookies;
  const username = session.username;
  const { postId } = req.params
  const usersData = readUserData();
  const postsData = readPostsData();

  const user = usersData.find((user) => user.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const post = postsData.find((post) => post.timestamp === parseInt(postId));
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  if (post.likedUsers.includes(username)) {
    post.likes -= 1;

    var index = post.likedUsers.indexOf(username);
    if (index !== -1) {
      post.likedUsers.splice(index, 1);
    }
    savePostsData(postsData);
  }

  res.json({ message: 'Post unliked successfully.', likes: post.likes });
});

module.exports = router;