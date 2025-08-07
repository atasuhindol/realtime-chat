const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/send', auth, messageController.sendMessage);
router.get('/:conversationId', auth, messageController.getMessages);
router.put('/:messageId/read', auth, messageController.markAsRead);

module.exports = router;