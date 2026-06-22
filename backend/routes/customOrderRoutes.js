const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCustomOrders, createCustomOrder, updateCustomOrderStatus, deleteCustomOrder } = require('../controllers/customOrderController');

router.get('/', protect, getCustomOrders);
router.post('/', protect, createCustomOrder);
router.put('/:id/status', protect, updateCustomOrderStatus);
router.delete('/:id', protect, deleteCustomOrder);

module.exports = router;
