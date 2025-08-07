const { createClient } = require('redis');

let client;

const connectRedis = async () => {
  client = createClient({
    url: 'redis://localhost:6379'
  });

  client.on('error', err => console.error('❌ Redis Client Error', err));
  await client.connect();
  console.log('✅ Redis connected');
};

const getRedisClient = () => client;

module.exports = connectRedis;
module.exports.getRedisClient = getRedisClient;
