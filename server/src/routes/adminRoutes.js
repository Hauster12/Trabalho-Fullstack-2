const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');

router.get('/dashboard-stats', getDashboardStats);

module.exports = router;
