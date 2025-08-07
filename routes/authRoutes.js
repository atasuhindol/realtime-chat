const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

router.post(
  '/register',
  [
    body('username').isLength({ min: 3 }).trim().escape().withMessage('Kullanıcı adı en az 3 karakter olmalı'),
    body('email').isEmail().normalizeEmail().withMessage('Geçerli bir email girin'),
    body('password').isLength({ min: 6 }).trim().escape().withMessage('Şifre en az 6 karakter olmalı')
  ],
  authController.register
);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/me', authController.getProfile);

module.exports = router;