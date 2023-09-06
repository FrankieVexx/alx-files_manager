#!/usr/bin/env node
const uuidv4 = require('uuid/v4');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
const bcrypt = require('bcrypt');

class AuthController {
  static async getConnect(req, res) {
    try {
      // Parse the Basic auth header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [email, password] = credentials.split(':');

      // Find the user by email
      const user = await dbClient.getUserByEmail(email);

      // Check if the user exists and the password is correct
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Generate a random token
      const token = uuidv4();

      // Store the user ID in Redis with the token as the key (valid for 24 hours)
      await redisClient.set(`auth_${token}`, user._id.toString(), 'EX', 24 * 60 * 60);

      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error signing in:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getDisconnect(req, res) {
    try {
      // Retrieve the token from the X-Token header
      const token = req.headers['x-token'];

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Delete the token from Redis
      await redisClient.del(`auth_${token}`);

      return res.status(204).end();
    } catch (error) {
      console.error('Error signing out:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = AuthController;

