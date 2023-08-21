// server.js
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const register = require('./screens/register');
const login = require('./screens/login');
const logout = require('./screens/logout');
const following = require('./screens/following');
const feed = require('./screens/feed');
const admin = require('./screens/admin');
const search = require('./screens/search');

// Middleware to check if the user is authenticated
function requireAuthentication(req, res, next) {
  const { session } = req.cookies;

  // Check if the user is authenticated based on the session cookie
  if (!session || !session.username) {
    // If not authenticated, redirect to login page for protected routes
    return res.redirect('/login.html'); // Replace with the appropriate login page URL
  }

  // If authenticated, proceed to the next middleware
  next();
}

// Middleware to check if the user is admin
function isAdmin(req, res, next) {
  const { session } = req.cookies;
  
  // Check if the user is logged in and is the admin
  if (!session || !session.username || session.username !== 'admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }
  
  // User is authenticated and is an admin, proceed to the next middleware/route
  next();
}

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Register and login routes
// Serve public pages without authentication
app.use(login);
app.use(logout);
app.use(register);

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/login.html'));
});
// http://localhost:3000/

app.get('/', (req, res) => {
  // Render login template
  res.sendFile(path.join(__dirname + '/login.html'));
});
// Serve public pages without authentication

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});
// Following and feed routes

app.use(requireAuthentication);
app.use(following);
app.use(feed);
app.use(search);

app.get('/feed.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'screens/feed.html'));
});

app.get('/search.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'screens/search.html'));
});

// Admin routes
app.use('/admin', isAdmin, admin); 

app.get('/admin.html', isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'screens/admin.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});