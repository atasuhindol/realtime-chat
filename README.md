# Realtime Chat Project

This project is a Node.js and Express-based real-time chat application with automated messaging features. It includes JWT authentication, Socket.IO for instant communication, MongoDB for data storage, Redis for caching and online user tracking, RabbitMQ for queue management, cron jobs for automated message scheduling, and various security/optimization features.

## Features

- User registration and login (JWT authentication)
- Real-time chat (Socket.IO)
- Automated message scheduling and sending (RabbitMQ + cron)
- Online user tracking (Redis)
- API documentation (Swagger/OpenAPI)
- Rate limiting, input validation/sanitization, security headers (Helmet)
- Logging (Winston)
- MongoDB indexing and optimization

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start required services:**
   - MongoDB
   - Redis
   - RabbitMQ

3. **Create a `.env` file:**
   ```
   MONGO_URI=mongodb://localhost:27017/realtime-chat
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   or for development:
   ```bash
   npm run dev
   ```

5. **Frontend access:**
   - [http://localhost:3000/auth.html](http://localhost:3000/auth.html) (Register/Login/Profile)
   - [http://localhost:3000/index.html](http://localhost:3000/index.html) (Simple chat UI)
   - [http://localhost:3000/api-docs](http://localhost:3000/api-docs) (Swagger API documentation)

## Technologies & Versions

| Technology            | Version        |
|-----------------------|---------------|
| Node.js               | 20.19.4       |
| npm                   | 10.8.2        |
| express               | ^4.x          |
| socket.io             | ^4.x          |
| mongoose              | ^7.x          |
| redis                 | ^4.x          |
| amqplib (RabbitMQ)    | ^0.10.x       |
| express-validator     | ^7.x          |
| express-rate-limit    | ^7.x          |
| helmet                | ^7.x          |
| winston               | ^3.x          |
| swagger-jsdoc         | ^6.x          |
| swagger-ui-express    | ^4.x          |
| bcrypt                | ^5.x          |
| dotenv                | ^17.x         |

> Note: Versions should be updated according to your `package.json`.

## License

This project is licensed under the [MIT License](./LICENSE).