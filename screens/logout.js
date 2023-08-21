const express = require('express');
const router = express.Router();
const { readUserData, saveUserData } = require('./persist');

router.post('/logout', (req, res) => {
    const { session } = req.cookies;
    const usersData = readUserData();

    const userIndex = usersData.findIndex((user) => user.username === session.username);

    if (userIndex !== -1) {
        // Add logout event to activityHistory
        usersData[userIndex].activityHistory.push({
            event: 'logout',
            timestamp: new Date().toISOString()
        });

        // Update lastLogout timestamp
        usersData[userIndex].lastLogout = new Date().toISOString();
        saveUserData(usersData);
    }

    // Clear the session cookie to log the user out
    res.clearCookie('session');
    res.json({
        message: 'Logout successful.'
    });
});

module.exports = router;
