const mongoose = require('mongoose');
const User = require('../models/User');
const AutoMessage = require('../models/AutoMessage');
require('dotenv').config();

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function planAutoMessages() {
  await mongoose.connect(process.env.MONGO_URI);

  // Active users
  const users = await User.find({});
  if (users.length < 2) return;

  const shuffled = shuffle(users.map(u => u._id));
  const pairs = [];
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    pairs.push([shuffled[i], shuffled[i + 1]]);
  }

  for (const [sender, receiver] of pairs) {
    const content = `Otomatik mesaj: ${Math.random().toString(36).substring(2, 10)}`;
    const sendDate = new Date();
    sendDate.setHours(2, 0, 0, 0); // 02:00

    await AutoMessage.create({
      sender,
      receiver,
      content,
      sendDate,
      isQueued: false,
      isSent: false
    });
  }

  console.log('Otomatik mesajlar planlandı.');
  mongoose.disconnect();
}

// Real cron
// planAutoMessages();

module.exports = planAutoMessages;