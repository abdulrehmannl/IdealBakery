/**
 * routes/counterRoutes.js — Counter Sales API Routes
 * ====================================================
 * Mounted: app.use('/api/counter', counterRoutes)
 * All routes: Admin/Manager only
 *
 *   GET    /api/counter        → getAllCounterSales (?branch ?cashier ?paymentMethod ?dateFrom ?dateTo)
 *   GET    /api/counter/:id    → getSingleCounterSale
 *   POST   /api/counter        → createCounterSale
 *   PUT    /api/counter/:id    → updateCounterSale
 *   DELETE /api/counter/:id    → deleteCounterSale
 */

const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getAllCounterSales, getSingleCounterSale, createCounterSale, updateCounterSale, deleteCounterSale } = require('../controllers/counterController');

router.get('/',       protect, adminOnly, getAllCounterSales);
router.get('/:id',    protect, adminOnly, getSingleCounterSale);
router.post('/',      protect, adminOnly, createCounterSale);
router.put('/:id',    protect, adminOnly, updateCounterSale);
router.delete('/:id', protect, adminOnly, deleteCounterSale);

module.exports = router;
/* END — File: routes/counterRoutes.js  Mounted: /api/counter */
