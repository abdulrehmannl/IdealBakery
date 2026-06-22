const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getWasteLogs, createWasteLog, deleteWasteLog } = require('../controllers/wasteController');

router.get('/', protect, getWasteLogs);
router.post('/', protect, createWasteLog);
router.delete('/:id', protect, deleteWasteLog);

module.exports = router;
