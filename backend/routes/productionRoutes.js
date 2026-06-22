const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getBatches, createBatch, updateBatchStatus, deleteBatch } = require('../controllers/productionController');

router.get('/', protect, getBatches);
router.post('/', protect, createBatch);
router.put('/:id/status', protect, updateBatchStatus);
router.delete('/:id', protect, deleteBatch);

module.exports = router;
