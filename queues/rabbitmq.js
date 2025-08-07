const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async () => {
  const connection = await amqp.connect('amqp://localhost');
  channel = await connection.createChannel();
  await channel.assertQueue('chat_messages');
  console.log('RabbitMQ connected and listening');
};

const getChannel = () => channel;

module.exports = connectRabbitMQ;
module.exports.getChannel = getChannel;
