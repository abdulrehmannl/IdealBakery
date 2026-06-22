const express = require('express');
const router = express.Router();
const { protect, adminOrManager } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/dashboardController');

// Dashboard routes allowed for admin and manager
router.get('/stats', protect, adminOrManager, getDashboardStats);

module.exports = router;
