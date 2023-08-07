// persist.js
const fs = require('fs');

const userDataFilePath = './data/users.json';
const postsDataFilePath = './data/posts.json';

function readUserData() {
  try {
    const usersData = JSON.parse(fs.readFileSync(userDataFilePath, 'utf-8'));
    return usersData;
  } catch (error) {
    console.error('Error reading user data:', error);
    return [];
  }
}

function saveUserData(usersData) {
  try {
    fs.writeFileSync(userDataFilePath, JSON.stringify(usersData, null, 2));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

function readPostsData() {
  try {
    const postsData = JSON.parse(fs.readFileSync(postsDataFilePath, 'utf-8'));
    return postsData;
  } catch (error) {
    console.error('Error reading posts data:', error);
    return [];
  }
}

function savePostsData(postsData) {
  try {
    fs.writeFileSync(postsDataFilePath, JSON.stringify(postsData, null, 2));
  } catch (error) {
    console.error('Error saving posts data:', error);
  }
}

module.exports = {
  readUserData,
  saveUserData,
  readPostsData,
  savePostsData,
};
