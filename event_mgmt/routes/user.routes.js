const express = require('express');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Get User Profile
router.get('/profile', authenticateToken, (req, res) => {
    res.json(req.user);
});

module.exports = router;
