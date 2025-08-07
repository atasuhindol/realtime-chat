const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const auth = require('../middleware/auth');

router.get('/', auth, conversationController.listConversations);

module.exports = router;