const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    submitApplication,
    getApplications,
    updateApplicationStatus
} = require('../controllers/jobController');

router.post('/', submitApplication);
router.get('/', protect, getApplications);
router.put('/:id/status', protect, updateApplicationStatus);

module.exports = router;
