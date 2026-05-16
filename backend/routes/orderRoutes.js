/**
 * routes/orderRoutes.js — Order API Routes
 * ==========================================
 * Mounted: app.use('/api/orders', orderRoutes)
 *
 *   POST   /api/orders               → createOrder       (any logged-in user)
 *   GET    /api/orders               → getAllOrders       (any logged-in user)
 *   GET    /api/orders/:id           → getSingleOrder     (any logged-in user)
 *   PUT    /api/orders/:id/status    → updateOrderStatus  (Admin/Manager)
 *   DELETE /api/orders/:id           → deleteOrder        (Admin/Manager)
 *
 * WHY ALL ROUTES ARE PROTECTED:
 * Orders contain personal data (addresses, phones). Nobody should view
 * orders without being logged in. The controller itself further limits
 * customers to only seeing their own orders.
 */

const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
    createOrder, getAllOrders, getSingleOrder,
    updateOrderStatus, deleteOrder,
} = require('../controllers/orderController');

router.post('/',               protect,              createOrder);
router.get('/',                protect,              getAllOrders);
router.get('/:id',             protect,              getSingleOrder);
router.put('/:id/status',      protect, adminOnly,   updateOrderStatus);
router.delete('/:id',          protect, adminOnly,   deleteOrder);

module.exports = router;

/*
 * END OF FILE SUMMARY
 * =====================
 * File: routes/orderRoutes.js   Mounted: /api/orders
 * Route             Method   Middleware           Controller
 * /                 POST     protect              createOrder
 * /                 GET      protect              getAllOrders
 * /:id              GET      protect              getSingleOrder
 * /:id/status       PUT      protect, adminOnly   updateOrderStatus
 * /:id              DELETE   protect, adminOnly   deleteOrder
 */
