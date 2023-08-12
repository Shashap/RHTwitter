const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
    // Clear the session cookie to log the user out
    res.clearCookie('session');
    res.json({
        message: 'Logout successful.'
    });
});

module.exports = router;
