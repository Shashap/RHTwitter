// register.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { readUserData, saveUserData } = require('./persist');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const usersData = readUserData();

  const existingUser = usersData.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).json({ error: 'Username already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPassword, followers: [], following: [], activityHistory: []};
  usersData.push(newUser);
  saveUserData(usersData);

  res.json({ message: 'Registration successful.' });
});

module.exports = router;
