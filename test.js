const assert = require('assert');
const express = require('express');

const PORT = 3000; 
const BASE_URL = `http://localhost:${PORT}`;

const app = express();
const { readUserData, readPostsData } = require('./routes/persist');

before(function () {
  app.listen(PORT);
});

import('node-fetch').then(({ default: fetch }) => {

// Test for the /feed route
describe('/feed route', function () {
  it('should return status 200 and JSON data', async function () {
    const res = await fetch(`${BASE_URL}/feed`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('content-type'), 'application/json; charset=utf-8');
  });

  it('should return an error if the user is not logged in', async function () {
    // Simulate a scenario where the user is not logged in
    // You can do this by not sending the session cookie in the request headers
    const res = await fetch(`${BASE_URL}/feed`, {
      headers: {
        // Omit the session cookie
      },
    });
    const data = await res.json();

    assert.strictEqual(res.status, 401); // Unauthorized
    assert.strictEqual(data.error, 'Unauthorized. Please log in first.');
  });
});

// Test for the /feed/like/:postId route
describe('/feed/like/:postId route', function () {
  it('should like a post', async function () {
    // Prepare data, for example, create a user and a post
    const usersData = readUserData(); // Read users data
    const postsData = readPostsData(); // Read posts data

    // Simulate a scenario where a user is logged in
    // You can do this by setting the session cookie in the request headers
    const sessionCookie = `username=${encodeURIComponent('testuser')}`;
    const headers = {
      Cookie: sessionCookie,
      'Content-Type': 'application/json',
    };

    // Send a request to like a post
    const postIdToLike = 1; // Replace with the actual post ID
    const res = await fetch(`${BASE_URL}/feed/like/${postIdToLike}`, {
      method: 'POST',
      headers,
    });
    const data = await res.json();

    // Verify that the post was liked successfully
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.message, 'Post liked successfully.');

  });

});

// Test for the /search route
describe('/search route', function () {
  it('should return status 200 and JSON data', async function () {
    const query = 'testquery'; // Replace with a query parameter
    const res = await fetch(`${BASE_URL}/search?query=${query}`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('content-type'), 'application/json; charset=utf-8');
  });

  it('should return an error if the user is not logged in', async function () {
    // Simulate a scenario where the user is not logged in
    // You can do this by not sending the session cookie in the request headers
    const query = 'testquery'; // Replace with a query parameter
    const res = await fetch(`${BASE_URL}/search?query=${query}`, {
      headers: {
        // Omit the session cookie
      },
    });
    const data = await res.json();

    assert.strictEqual(res.status, 401); // Unauthorized
    assert.strictEqual(data.error, 'Unauthorized. Please log in first.');
  });
});

// Test for the /searchPosts route
describe('/searchPosts route', function () {
  it('should return status 200 and JSON data', async function () {
    const query = 'testquery'; // Replace with a query parameter
    // Simulate a scenario where the user is logged in
    // You can do this by setting the session cookie in the request headers
    const sessionCookie = `username=${encodeURIComponent('testuser')}`;
    const headers = {
      Cookie: sessionCookie,
    };
    const res = await fetch(`${BASE_URL}/searchPosts?query=${query}`, {
      headers,
    });
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('content-type'), 'application/json; charset=utf-8');
  });

  it('should return an error if the user is not logged in', async function () {
    // Simulate a scenario where the user is not logged in
    // You can do this by not sending the session cookie in the request headers
    const query = 'testquery'; // Replace with a query parameter
    const res = await fetch(`${BASE_URL}/searchPosts?query=${query}`, {
      headers: {
        // Omit the session cookie
      },
    });
    const data = await res.json();

    assert.strictEqual(res.status, 401); // Unauthorized
    assert.strictEqual(data.error, 'Unauthorized. Please log in first.');
  });

});

// Test for the /register route
describe('/register route', function () {
  beforeEach(function () {
    // Reset the users data before each test
    saveUserData([]);
  });

  it('should register a new user and return status 200 and JSON data', async function () {
    const username = 'testuser';
    const password = 'testpassword';

    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('content-type'), 'application/json; charset=utf-8');
    assert.strictEqual(data.message, 'Registration successful.');

    // Check if the user was actually added to the data store
    const usersData = readUserData();
    const newUser = usersData.find((user) => user.username === username);
    assert(newUser, 'New user should exist in data store');
  });

  it('should return an error if the username already exists', async function () {
    const username = 'existinguser';
    const password = 'testpassword';

    // Create an existing user
    const existingUser = { username, password: 'hashedpassword', followers: [], following: [], activityHistory: [] };
    const usersData = [existingUser];
    saveUserData(usersData);

    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    assert.strictEqual(res.status, 409); // Conflict
    assert.strictEqual(data.error, 'Username already exists.');

    // Check that the existing user data remains unchanged
    const updatedUsersData = readUserData();
    assert.deepStrictEqual(updatedUsersData, usersData);
  });
});

// Test for the /logout route
describe('/logout route', function () {
  it('should log out the user and return status 200 and JSON data', async function () {
    // Create a user session by setting a session cookie
    const username = 'testuser';
    const sessionCookie = { username };
    const resSetCookie = await fetch(`${BASE_URL}/set-cookie`, {
      method: 'POST',
      body: JSON.stringify(sessionCookie),
      headers: { 'Content-Type': 'application/json' },
    });

    assert.strictEqual(resSetCookie.status, 200);

    // Perform a logout request
    const resLogout = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
    });
    const data = await resLogout.json();

    assert.strictEqual(resLogout.status, 200);
    assert.strictEqual(resLogout.headers.get('content-type'), 'application/json; charset=utf-8');
    assert.strictEqual(data.message, 'Logout successful.');

    // Check that the session cookie is cleared
    const cookies = resLogout.headers.get('set-cookie');
    assert(!cookies || cookies.length === 0, 'Session cookie should be cleared');

    // Check that the user's activity history and lastLogout are updated
    const usersData = readUserData();
    const user = usersData.find((user) => user.username === username);
    assert(user, 'User should exist in data store');
    assert(user.activityHistory.length > 0, 'Activity history should be updated');
    assert(user.lastLogout, 'Last logout timestamp should be updated');
  });
});

// Test for the /login route
describe('/login route', function () {
  it('should log in the user and return status 200 and JSON data', async function () {
    // Create a user for testing
    const username = 'testuser';
    const password = 'testpassword';
    const hashedPassword = await bcrypt.hash(password, 10);

    const usersData = readUserData();
    usersData.push({ username, password: hashedPassword, activityHistory: [] });
    saveUserData(usersData);

    // Perform a login request
    const loginData = { username, password, rememberMe: false }; // Adjust rememberMe as needed
    const resLogin = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(loginData),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await resLogin.json();

    assert.strictEqual(resLogin.status, 200);
    assert.strictEqual(resLogin.headers.get('content-type'), 'application/json; charset=utf-8');
    assert.strictEqual(data.message, 'Login successful.');

    // Check that the session cookie is set
    const sessionCookie = resLogin.headers.get('set-cookie');
    assert(sessionCookie && sessionCookie.length > 0, 'Session cookie should be set');

    // Check that the user's activity history and lastLogin are updated
    const updatedUsersData = readUserData();
    const user = updatedUsersData.find((user) => user.username === username);
    assert(user, 'User should exist in data store');
    assert(user.activityHistory.length > 0, 'Activity history should be updated');
    assert(user.lastLogin, 'Last login timestamp should be updated');
  });
});

// Test for the /following/:username route
describe('/following/:username route', function () {
  it('should return the list of following users', async function () {
    // Create a user and a user to follow for testing
    const userToFollow = { username: 'followedUser', followers: [], following: [] };
    const followerUser = { username: 'followerUser', followers: [], following: ['followedUser'] };

    const usersData = readUserData();
    usersData.push(userToFollow, followerUser);
    saveUserData(usersData);

    // Perform a request to get the list of following users
    const res = await fetch(`${BASE_URL}/following/followerUser`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert(Array.isArray(data));
    assert.strictEqual(data.length, 1);
    assert.strictEqual(data[0].username, 'followedUser');
  });

  it('should return 404 if the user is not found', async function () {
    // Perform a request to get the list of following users for a non-existent user
    const res = await fetch(`${BASE_URL}/following/nonExistentUser`);
    assert.strictEqual(res.status, 404);
  });
});

// Test for the /follow/:username route
describe('/follow/:username route', function () {
  it('should follow a user and return status 200 and JSON data', async function () {
    // Create a user to follow and a follower user for testing
    const userToFollow = { username: 'followedUser', followers: [], following: [] };
    const followerUser = { username: 'followerUser', followers: [], following: [] };

    const usersData = readUserData();
    usersData.push(userToFollow, followerUser);
    saveUserData(usersData);

    // Perform a follow request
    const res = await fetch(`${BASE_URL}/follow/followedUser`, {
      method: 'POST',
      headers: {
        'Cookie': 'session=followerUser', // Simulate being logged in as 'followerUser'
        'Content-Type': 'application/json'
      },
    });
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('content-type'), 'application/json; charset=utf-8');
    assert.strictEqual(data.username, 'followedUser');

    // Check that the user and follower data is updated
    const updatedUsersData = readUserData();
    const user = updatedUsersData.find((u) => u.username === 'followedUser');
    const follower = updatedUsersData.find((u) => u.username === 'followerUser');
    assert(user.followers.includes('followerUser'));
    assert(follower.following.includes('followedUser'));
  });

  it('should return 404 if the user to follow is not found', async function () {
    // Create a follower user for testing
    const followerUser = { username: 'followerUser', followers: [], following: [] };

    const usersData = readUserData();
    usersData.push(followerUser);
    saveUserData(usersData);

    // Perform a follow request for a non-existent user
    const res = await fetch(`${BASE_URL}/follow/nonExistentUser`, {
      method: 'POST',
      headers: {
        'Cookie': 'session=followerUser', // Simulate being logged in as 'followerUser'
        'Content-Type': 'application/json'
      },
    });
    assert.strictEqual(res.status, 404);
  });
});

// Test for the /unfollow/:username route
describe('/unfollow/:username route', function () {
  it('should unfollow a user', async function () {
    // Create some users and establish a follow relationship for testing
    const users = [
      { username: 'user1', following: ['user2'] },
      { username: 'user2', followers: ['user1'] },
    ];

    const usersData = readUserData();
    usersData.push(...users);
    saveUserData(usersData);

    // Perform a request to unfollow a user
    const res = await fetch(`${BASE_URL}/admin/unfollow/user2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const updatedUser = await res.json();

    assert.strictEqual(res.status, 200);
    assert(Array.isArray(updatedUser.followers));
    assert.strictEqual(updatedUser.followers.length, 0);

    // Check if the follow relationship was removed
    const remainingUsers = readUserData();

    const user1 = remainingUsers.find((user) => user.username === 'user1');
    const user2 = remainingUsers.find((user) => user.username === 'user2');

    assert.strictEqual(user1.following.length, 0);
    assert.strictEqual(user2.followers.length, 0);
  });

  it('should handle unfollowing a non-existent user', async function () {
    // Perform a request to unfollow a non-existent user
    const res = await fetch(`${BASE_URL}/admin/unfollow/nonexistentuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();

    assert.strictEqual(res.status, 404);
    assert.strictEqual(data.error, 'User not found.');
  });
});

// Test for the /favorites route
describe('/favorites route', function () {
  it('should return a list of favorite posts for a logged-in user', async function () {
    // Create a user and some posts for testing
    const user = { username: 'testuser', savedPosts: ['1', '3', '5'] };
    const posts = [
      { timestamp: '1', text: 'Post 1' },
      { timestamp: '2', text: 'Post 2' },
      { timestamp: '3', text: 'Post 3' },
      { timestamp: '4', text: 'Post 4' },
      { timestamp: '5', text: 'Post 5' },
    ];

    const usersData = readUserData();
    const postsData = readPostsData();
    usersData.push(user);
    postsData.push(...posts);
    saveUserData(usersData);

    // Perform a request to get the list of favorite posts
    const res = await fetch(`${BASE_URL}/favorites`, {
      headers: {
        'Cookie': 'session=testuser', // Simulate being logged in as 'testuser'
      },
    });
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert(Array.isArray(data));
    assert.strictEqual(data.length, 3);
    assert.strictEqual(data[0].timestamp, '1');
    assert.strictEqual(data[1].timestamp, '3');
    assert.strictEqual(data[2].timestamp, '5');
  });

  it('should return 401 if the user is not logged in', async function () {
    // Perform a request to get the list of favorite posts without a valid session
    const res = await fetch(`${BASE_URL}/favorites`);
    assert.strictEqual(res.status, 401);
  });

  it('should return 404 if the user does not exist', async function () {
    // Create some posts for testing, but do not create a user
    const posts = [
      { timestamp: '1', text: 'Post 1' },
      { timestamp: '2', text: 'Post 2' },
      { timestamp: '3', text: 'Post 3' },
    ];

    const postsData = readPostsData();
    postsData.push(...posts);

    // Perform a request to get the list of favorite posts for a non-existent user
    const res = await fetch(`${BASE_URL}/favorites`, {
      headers: {
        'Cookie': 'session=nonExistentUser', // Simulate being logged in as a non-existent user
      },
    });
    assert.strictEqual(res.status, 404);
  });
});

// Test for the /activity route
describe('/activity route', function () {
  it('should return user activity logs', async function () {
    // Create some users and posts for testing
    const users = [
      {
        username: 'user1',
        activityHistory: [{ event: 'login', timestamp: 'timestamp1' }],
      },
      {
        username: 'user2',
        activityHistory: [{ event: 'login', timestamp: 'timestamp2' }],
      },
    ];

    const posts = [
      { username: 'user1', text: 'Post 1' },
      { username: 'user2', text: 'Post 2' },
    ];

    const usersData = readUserData();
    const postsData = readPostsData();
    usersData.push(...users);
    postsData.push(...posts);
    saveUserData(usersData);
    savePostsData(postsData);

    // Perform a request to get user activity logs
    const res = await fetch(`${BASE_URL}/admin/activity`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert(Array.isArray(data));
    assert.strictEqual(data.length, 2);
    assert.strictEqual(data[0].username, 'user1');
    assert.strictEqual(data[1].username, 'user2');
  });
});

// Test for the /users route
describe('/users route', function () {
  it('should return a list of users', async function () {
    // Create some users for testing
    const users = [
      { username: 'user1' },
      { username: 'user2' },
      { username: 'user3' },
    ];

    const usersData = readUserData();
    usersData.push(...users);
    saveUserData(usersData);

    // Perform a request to get the list of users
    const res = await fetch(`${BASE_URL}/admin/users`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert(Array.isArray(data));
    assert.strictEqual(data.length, 3);
    assert.strictEqual(data[0].username, 'user1');
    assert.strictEqual(data[1].username, 'user2');
    assert.strictEqual(data[2].username, 'user3');
  });
});

// Test for the /users/delete route
describe('/users/delete route', function () {
  it('should delete selected users and their posts', async function () {
    // Create some users and posts for testing
    const users = [
      { username: 'user1' },
      { username: 'user2' },
      { username: 'user3' },
    ];

    const posts = [
      { username: 'user1', text: 'Post 1' },
      { username: 'user2', text: 'Post 2' },
      { username: 'user3', text: 'Post 3' },
    ];

    const usersData = readUserData();
    const postsData = readPostsData();
    usersData.push(...users);
    postsData.push(...posts);
    saveUserData(usersData);
    savePostsData(postsData);

    // Perform a request to delete selected users
    const res = await fetch(`${BASE_URL}/admin/users/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usersToDelete: ['user1', 'user3'] }),
    });
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.message, 'Selected users removed successfully');

    // Check if the users and their posts were deleted
    const remainingUsers = readUserData();
    const remainingPosts = readPostsData();

    assert.strictEqual(remainingUsers.length, 1);
    assert.strictEqual(remainingUsers[0].username, 'user2');

    assert.strictEqual(remainingPosts.length, 1);
    assert.strictEqual(remainingPosts[0].username, 'user2');
  });
});

// Test for the /features route
describe('/features route', function () {
  it('should update feature statuses in the config', async function () {
    // Perform a request to update feature statuses
    const res = await fetch(`${BASE_URL}/admin/features`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedFilter: true,
        feedSort: false,
        favorites: true,
        searchPosts: false,
      }),
    });
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.message, 'Feature status updated successfully');
  });
});

after(function () {
  // Replace with code to stop your server gracefully if needed
});

}).catch((error) => {
  console.error('Error importing node-fetch:', error);
});