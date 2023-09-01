const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { readUserData, saveUserData } = require('./persist');

router.use(cookieParser());

router.post('/login', async (req, res) => {

  const {username, password, rememberMe} = req.body;
  const usersData = readUserData();
  
  const user = usersData.find((user) => user.username === username);

  if (!user) {
    return res.status(401).json({error: 'Invalid credentials.'});
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({error: 'Invalid password.'});
  }

  // Add login event to activityHistory
  user.activityHistory.push({
    event: 'login',
    timestamp: new Date().toISOString()
  });

  // Update lastLogin timestamp
  user.lastLogin = new Date().toISOString();
  saveUserData(usersData);

  // Set session cookie
  //const sessionExpiration = rememberMe ? 10 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000; // 10 days or 30 minutes
  const sessionExpiration = rememberMe ? 1 * 60 * 1000 : 1; // 1min or none
  res.cookie('session', {username}, {maxAge: sessionExpiration, httpOnly: false});

  res.json({
    message: 'Login successful.'
  });
});

module.exports = router;
