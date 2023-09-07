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
const favorites = require('./screens/favorites');
const config = require('./screens/data/config.json');


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

// Middleware to check if the search feature us enabled
function searchEnabled(req, res, next) {
  if (!config.features.search) {
    return res.status(403).json({ error: 'Access denied.' });
  }
  next();
}

// Middleware to check if the search feature us enabled
function searchPostEnabled(req, res, next) {
  if (!config.features.searchPosts) {
    return res.status(403).json({ error: 'Access denied.' });
  }
  next();
}

// Middleware to check if the user is admin
function favoritesEnabled(req, res, next) {
  if (!config.features.favorites) {
    return res.status(403).json({ error: 'Access denied.' });
  }
  next();
}

const app = express();
// Serve static files (including CSS) from a directory
app.use(express.static('public'));

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

app.get('/logo.png', (req, res) => {
  res.sendFile(path.join(__dirname, '/pictures/logo.png'));
});

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'screens/style.css'));
});

app.get('/', (req, res) => {
  // Render login template
  res.sendFile(path.join(__dirname + '/login.html'));
});
// Serve public pages without authentication

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/readme.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'readme.html'));
});

app.get('/aboutus.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'aboutus.html'));
});

// Following and feed routes

app.use(requireAuthentication);
app.use(feed);
app.use(following);
app.use(search);


if (config.features.favorites) {
  app.use(favorites);
}

app.get('/feed.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'screens/feed.html'));
});

app.get('/search.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'screens/search.html'));
});

app.get('/searchPosts.html', searchPostEnabled, (req, res) => {
  res.sendFile(path.join(__dirname, 'screens/searchPosts.html'));
});

app.get('/favorites.html', favoritesEnabled, (req, res) => {
  res.sendFile(path.join(__dirname, 'screens/favorites.html'));
});

// Admin routes
app.use('/admin', isAdmin, admin); 

app.get('/admin.html', isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'screens/admin.html'));
});

// app.use('/admin/features', isAdmin, features);
// app.use('/admin/config', isAdmin, features);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});