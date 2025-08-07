const Message = require('../models/Message');
const { getRedisClient } = require('../config/redis');
const { getChannel } = require('../queues/rabbitmq');
const socketAuth = require('../middleware/socketAuth');

const handleChatSockets = (io) => {
  io.use(socketAuth);

  io.on('connection', async socket => {
    const user = socket.user;
    console.log(`Authenticated client: ${user.id} (${socket.id})`);

    const redis = getRedisClient();

    const cachedMessages = await redis.lRange('chat_messages', -10, -1);
    cachedMessages.forEach(msgStr => {
      const msg = JSON.parse(msgStr);
      socket.emit('chat message', msg);
    });

    socket.on('chat message', async msg => {
      console.log('Received message:', msg);

      try {
        const fullMessage = {
          username: user.username,
          text: msg.text,
          userId: user.id
        };

        // MongoDB
        await Message.create(fullMessage);

        // Redis
        await redis.rPush('chat_messages', JSON.stringify(fullMessage));
        await redis.lTrim('chat_messages', -10, -1);

        // RabbitMQ
        const channel = getChannel();
        channel.sendToQueue('chat_messages', Buffer.from(JSON.stringify(fullMessage)));

        // Broadcast
        socket.broadcast.emit('chat message', fullMessage);
      } catch (err) {
        console.error('Save error:', err);
      }
    });

    socket.on('disconnect', async () => {
      console.log(`Client disconnected: ${socket.id}`);

      await redis.sRem('online_users', userId);
      socket.broadcast.emit('user_offline', { userId });

    });
  });
};

module.exports = handleChatSockets;
