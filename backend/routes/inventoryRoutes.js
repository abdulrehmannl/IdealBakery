/**
 * routes/inventoryRoutes.js — Inventory API Routes
 * ==================================================
 * Mounted: app.use('/api/inventory', inventoryRoutes)
 * All routes: Admin/Manager only
 *
 *   GET    /api/inventory        → getAllInventory   (?branch ?lowStock=true)
 *   GET    /api/inventory/:id    → getSingleInventory
 *   POST   /api/inventory        → createInventory
 *   PUT    /api/inventory/:id    → updateInventory
 *   DELETE /api/inventory/:id    → deleteInventory
 */

const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getAllInventory, getSingleInventory, createInventory, updateInventory, deleteInventory } = require('../controllers/inventoryController');

router.get('/',       protect, adminOnly, getAllInventory);
router.get('/:id',    protect, adminOnly, getSingleInventory);
router.post('/',      protect, adminOnly, createInventory);
router.put('/:id',    protect, adminOnly, updateInventory);
router.delete('/:id', protect, adminOnly, deleteInventory);

module.exports = router;
/* END — File: routes/inventoryRoutes.js  Mounted: /api/inventory */
