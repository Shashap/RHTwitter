// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const register = require('./screens/register');
const login = require('./screens/login');
const following = require('./screens/following');
const feed = require('./screens/feed');
const admin = require('./screens/admin');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

// Register and login routes
app.use(register);
app.use(login);

// Following and feed routes
app.use(following);
app.use(feed);

// Admin routes
app.use('/admin', admin); // Add '/admin' prefix to the admin router

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
