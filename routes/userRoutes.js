const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/online', async (req, res) => {
  const redis = getRedisClient();
  const onlineUserIds = await redis.sMembers('online_users');
  res.json({ online: onlineUserIds });
});

router.get('/list', auth, userController.listUsers);

module.exports = router;