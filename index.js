require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const setupSwagger = require('./swagger');
const connectDB = require('./config/db');
const connectRedis = require('./config/redis');
const connectRabbitMQ = require('./queues/rabbitmq');
const handleChatSockets = require('./sockets/chat.js');
const limiter = require('./middleware/rateLimit');
const helmet = require('helmet');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(helmet()); // Security headers
app.use(express.static('public'));
app.use(express.json());
app.use(limiter); // Rate limiting middleware

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.handshake.auth.tokenUserId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

// API Routes
app.use('/api/auth', authRoutes);

// Swagger
setupSwagger(app);

// Base route
app.get('/', (req, res) => {
  res.send('Real-time chat server is running...');
});

// Start all connections
(async () => {
  await connectDB();
  await connectRedis();
  await connectRabbitMQ(io);
  handleChatSockets(io);

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
})();
