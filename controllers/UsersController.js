#!/usr/bin/env node

const bcrypt = require('bcrypt');
const dbClient = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    try {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
      }

      // Check if the email already exists in the database
      const existingUser = await dbClient.getExistingUser(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user object
      const newUser = {
        email,
        password: hashedPassword,
      };

      // Save the new user to the database
      const savedUser = await dbClient.saveUser(newUser);

      // Return the new user with only email and id
      const responseUser = {
        email: savedUser.email,
        id: savedUser._id, // MongoDB auto-generated ID
      };

      return res.status(201).json(responseUser);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = UsersController;
