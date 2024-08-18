const { Event } = require('../models/event.model');
const fs = require('fs');

let events = []; // In-memory event storage


// Load events from file if exists
const loadEvents = () => {
    if (fs.existsSync('events.json')) {
        const data = fs.readFileSync('events.json');
        events = JSON.parse(data);
    }
};

// Save events to file
const saveEvents = () => {
    fs.writeFileSync('events.json', JSON.stringify(events, null, 2));
};

// Load users when server starts
loadEvents();

async function CreateAnEvent(req, res) {
    try {
        const { date, time, description } = req.body;

        if (!date || !time || !description) {
            return res.status(400).json({ message: 'Date, time, and description are required' });
        }

        //check if an event exists with same description
        const existingEventDescription = events.find(event => event.description === description);
        if (existingEventDescription) {
            return res.status(400).json({ message: 'An event alread exists with the same description' });
        }

        // Check if an event already exists for the same date, timme and description
        const existingEventDate = events.find(event => event.date === date && event.time === time);
        if (existingEventDate) {
            return res.status(400).json({ message: 'An event alread exists for the same date time' });
        }

        const newEvent = new Event(events.length + 1, date, time, description, req.user.username);

        events.push(newEvent);

        //save event to file
        saveEvents();

        res.status(201).json(newEvent);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

async function UpdateAnEvent(req, res) {
    try {

        const event = events.find(event => event.id === parseInt(req.params.id));

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.organizer !== req.user.username) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        const { date, time, description } = req.body;
        event.date = date;
        event.time = time;
        event.description = description;

        res.json(event);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function RegisterForAnEvent(req, res) {
    try {
        const event = events.find(e => e.id === parseInt(req.params.id));

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.addParticipant(req.user.username);
        res.json({ message: 'Registered for event', event });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { CreateAnEvent, UpdateAnEvent, RegisterForAnEvent };