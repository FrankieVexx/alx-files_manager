import { promisify } from 'util';
import { createClient } from 'redis';

/** Redis client */

class RedisClient {
  /**
     * a new RedisClient instance.
     */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
     * Check for active connection.
     */
  isAlive() {
    return this.isClientConnected;
  }

  /**
        * Gets the value of a given key.
     */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
     * Stores a key and its value along with an expiration time.
        * @param {String} key The key to set.
     */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
     * Removes the value of a given key.
     */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;

/* redis.js
const redis = require('redis');

const redisClient = redis.createClient({
  host: 'redis-server ',
  port: 6379, // Your Redis port
});

// Add the isAlive method
redisClient.isAlive = () => {
  return !!redisClient.connected;
};

module.exports = redisClient;
*/
