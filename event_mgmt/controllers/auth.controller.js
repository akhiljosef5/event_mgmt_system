const User = require('../models/user.model');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



let users = []; // In-memory user storage

// Load users from file if exists
const loadUsers = () => {
    if (fs.existsSync('users.json')) {
        const data = fs.readFileSync('users.json');
        users = JSON.parse(data);
    }
};

// Save users to file
const saveUsers = () => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

// Load users when server starts
loadUsers();

async function RegisterUser(req, res) {
    try {
        const { username, password, role, email } = req.body;

        // Basic validation
        if (!username || !password || !role || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = users.find(user => user.username === username || user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new User(username, email, hashedPassword, role);

        // Add the user to the in-memory array
        users.push(newUser);

        // Save the users array to a file
        saveUsers();

        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


async function LoginUser(req, res) {
    try {

        const { username, password } = req.body;
        const user = users.find(user => user.username === username);

        if (!user) return res.status(400).json({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ username, email: user.email, role: user.role }, 'secret_key', { expiresIn: '1h' });

        res.json({ token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { RegisterUser, LoginUser };