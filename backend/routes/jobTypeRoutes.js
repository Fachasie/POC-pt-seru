const express = require('express');
const router = express.Router();
const jobTypeController = require('../controllers/jobTypeController');

// -- Rute untuk Mengelola Koleksi (tanpa ID) --
router.get('/', jobTypeController.getJobTypes);

module.exports = router;