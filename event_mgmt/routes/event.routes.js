const express = require('express');
const { authenticateToken } = require('../middlewares/auth.middleware.js');
const { isOrganizer } = require('../middlewares/role.middleware');

const { CreateAnEvent, UpdateAnEvent, RegisterForAnEvent } = require('../controllers/event.controller');
const router = express.Router();

let events = []; // In-memory event storage

// Create Event
router.post('/', authenticateToken, isOrganizer, CreateAnEvent);


// Update Event
router.put('/:id', authenticateToken, isOrganizer, UpdateAnEvent);


// Register for Event
router.post('/:id/register', authenticateToken, RegisterForAnEvent);

module.exports = router;
