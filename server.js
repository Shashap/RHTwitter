// server.js
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const register = require('./routes/register');
const login = require('./routes/login');
const logout = require('./routes/logout');
const following = require('./routes/following');
const feed = require('./routes/feed');
const admin = require('./routes/admin');
const search = require('./routes/search');
const favorites = require('./routes/favorites');
const { readConfigData } = require('./routes/persist');


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

function featureEnabled(feature) {
  return function(req, res, next) {
    const config = readConfigData();
    if (!config.features[feature]) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    next();
  };
}

const app = express();

// Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
// Serve static files (including CSS) from a directory
app.use(express.static('public'));

// // Routes
app.use(login);
app.use(logout);
app.use(register);
app.use(requireAuthentication);
app.use(feed);
app.use(following);
app.use(search);
if (featureEnabled('favorites')) {
  app.use(favorites);
}

app.get('/logo.png', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/logo.png'));
});

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/style.css'));
});

app.get('/', (req, res) => {
  // Render login template
  res.sendFile(path.join(__dirname + '/public/login.html'));
});

app.get('/feed.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'screens/feed.html'));
});

app.get('/search.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'screens/search.html'));
});

app.get('/searchPosts.html', featureEnabled('searchPosts'), (req, res) => {
  res.sendFile(path.join(__dirname, 'screens/searchPosts.html'));
});

app.get('/favorites.html', featureEnabled('favorites'), (req, res) => {
  res.sendFile(path.join(__dirname, 'screens/favorites.html'));
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