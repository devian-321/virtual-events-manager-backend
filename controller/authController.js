const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, bcryptSaltRounds } = require('../config');
const users = require('../data/users');
const User = require('../models/user');

let userIdCounter = 1;

exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: 'User already exists.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);
        const newUser = new User(userIdCounter++, username, hashedPassword, role);
        users.push(newUser);

        console.log(`Email notification sent to ${username} for successful registration.`);

        res.status(201).json({ message: 'User registered successfully!', user: { id: newUser.id, username: newUser.username, role: newUser.role } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    try {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }


        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};