const amqp = require('amqplib');
const mongoose = require('mongoose');
const Message = require('../models/Message');
const AutoMessage = require('../models/AutoMessage');
require('dotenv').config();

const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer();
const io = new Server(server, { cors: { origin: '*' } });
server.listen(4001);

const startConsumer = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue('chat_messages');
  await channel.assertQueue('message_sending_queue');
  console.log('Consumer is listening for chat_messages and message_sending_queue...');

  channel.consume('chat_messages', async (msg) => {
    if (msg !== null) {
      const messageData = JSON.parse(msg.content.toString());
      console.log('Message received by worker:', messageData);

      try {
        await Message.create({
          username: messageData.username,
          text: messageData.text
        });
        channel.ack(msg);
      } catch (err) {
        console.error('Failed to save message:', err);
      }
    }
  });

  channel.consume('message_sending_queue', async (msg) => {
    if (msg !== null) {
      const autoMsg = JSON.parse(msg.content.toString());
      console.log('AutoMessage received by worker:', autoMsg);

      try {
        const savedMsg = await Message.create({
          sender: autoMsg.sender,
          receiver: autoMsg.receiver,
          text: autoMsg.content,
          createdAt: new Date()
        });

        await AutoMessage.findByIdAndUpdate(autoMsg._id, { isSent: true });

        io.to(autoMsg.receiver.toString()).emit('message_received', {
          sender: autoMsg.sender,
          content: autoMsg.content,
          messageId: savedMsg._id
        });

        channel.ack(msg);
      } catch (err) {
        console.error('Failed to process auto message:', err);
      }
    }
  });
};

io.on('connection', (socket) => {
  if (socket.handshake.auth && socket.handshake.auth.userId) {
    socket.join(socket.handshake.auth.userId);
  }
});

startConsumer();