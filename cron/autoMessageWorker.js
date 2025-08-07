const mongoose = require('mongoose');
const amqp = require('amqplib');
const AutoMessage = require('../models/AutoMessage');
require('dotenv').config();

async function queueAutoMessages() {
  await mongoose.connect(process.env.MONGO_URI);
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('message_sending_queue');

  const now = new Date();
  const messages = await AutoMessage.find({
    sendDate: { $lte: now },
    isQueued: false,
    isSent: false
  });

  for (const msg of messages) {
    channel.sendToQueue('message_sending_queue', Buffer.from(JSON.stringify(msg)));
    await AutoMessage.findByIdAndUpdate(msg._id, { isQueued: true });
  }

  console.log(`${messages.length} otomatik mesaj kuyruğa alındı.`);
  await channel.close();
  await connection.close();
  mongoose.disconnect();
}

// Real cron
// queueAutoMessages();

module.exports = queueAutoMessages;