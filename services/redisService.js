const { createClient } = require('redis');
require('dotenv').config();

const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

redis.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
  if (!redis.isOpen) await redis.connect();
}

// Add online user
async function addOnlineUser(userId) {
  await connectRedis();
  await redis.sAdd('online_users', userId.toString());
}

// Remove online user
async function removeOnlineUser(userId) {
  await connectRedis();
  await redis.sRem('online_users', userId.toString());
}

// Get all online users
async function getOnlineUsers() {
  await connectRedis();
  return await redis.sMembers('online_users');
}

// Cache conversation data
async function cacheConversation(conversationId, data) {
  await connectRedis();
  await redis.set(`conversation:${conversationId}`, JSON.stringify(data), { EX: 3600 });
}

// Get cached conversation data
async function getCachedConversation(conversationId) {
  await connectRedis();
  const data = await redis.get(`conversation:${conversationId}`);
  return data ? JSON.parse(data) : null;
}

// Set session data
async function setSession(userId, sessionData) {
  await connectRedis();
  await redis.set(`session:${userId}`, JSON.stringify(sessionData), { EX: 86400 }); // 1 gün
}

// Get session data
async function getSession(userId) {
  await connectRedis();
  const data = await redis.get(`session:${userId}`);
  return data ? JSON.parse(data) : null;
}

// Set temporary data with TTL
async function setTempData(key, value, ttl = 300) {
  await connectRedis();
  await redis.set(`temp:${key}`, JSON.stringify(value), { EX: ttl });
}

// Get temporary data
async function getTempData(key) {
  await connectRedis();
  const data = await redis.get(`temp:${key}`);
  return data ? JSON.parse(data) : null;
}

module.exports = {
  addOnlineUser,
  removeOnlineUser,
  getOnlineUsers,
  cacheConversation,
  getCachedConversation,
  setSession,
  getSession,
  setTempData,
  getTempData,
  redis
};