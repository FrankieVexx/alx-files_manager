#!/usr/bin/env node

const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    this.dbUrl = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(this.dbUrl, { useUnifiedTopology: true });

    this.establishConnection();
  }

  async establishConnection() {
    try {
      await this.client.connect();
      console.log('MongoDB connection established');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }

  async isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    try {
      const collection = this.client.db().collection('users');
      const count = await collection.countDocuments();
      return count;
    } catch (error) {
      console.error('Error counting users:', error);
      return 0;
    }
  }

  async nbFiles() {
    try {
      const collection = this.client.db().collection('files');
      const count = await collection.countDocuments();
      return count;
    } catch (error) {
      console.error('Error counting files:', error);
      return 0;
    }
  }
}

const dbClient = new DBClient();

module.exports = dbClient;
