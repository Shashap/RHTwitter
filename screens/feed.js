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

  const following = user.following;
  const feedPosts = postsData.filter((post) => following.includes(post.username) || post.username === username);

  res.json(feedPosts);
});

// Add a new post
router.post('/feed', (req, res) => {
  const { session } = req.cookies;
  const username = session.username;
  const { text } = req.body;

  const usersData = readUserData();
  const postsData = readPostsData();

  const user = usersData.find((user) => user.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (!text || text.length > 300) {
    return res.status(400).json({ error: 'Invalid post. Post must be less than 300 characters.' });
  }

  const newPost = {
    username,
    text,
    timestamp: Date.now(),
    likes: 0,
  };

  postsData.push(newPost);
  savePostsData(postsData);

  res.json({ message: 'Post created successfully.', post: newPost });
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

  const post = postsData.find((post) => post.username === username && post.timestamp === parseInt(postId));
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  post.likes += 1;
  savePostsData(postsData);

  res.json({ message: 'Post liked successfully.', likes: post.likes });
});

module.exports = router;
