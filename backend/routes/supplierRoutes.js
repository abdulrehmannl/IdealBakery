const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getSuppliers, createSupplier, updateSupplierStatus, deleteSupplier } = require('../controllers/supplierController');

router.get('/', protect, getSuppliers);
router.post('/', protect, createSupplier);
router.put('/:id/status', protect, updateSupplierStatus);
router.delete('/:id', protect, deleteSupplier);

module.exports = router;
