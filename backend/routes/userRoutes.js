const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// -- Rute untuk Mengelola Koleksi (tanpa ID) --
router.get('/', userController.getUsers);
router.post('/login', userController.login);

module.exports = router;