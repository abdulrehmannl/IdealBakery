/**
 * routes/leaveRoutes.js — Staff Leave API Routes
 * ================================================
 * Mounted: app.use('/api/leaves', leaveRoutes)
 * All routes: Admin/Manager only
 *
 *   GET    /api/leaves        → getAllLeaves    (?staff ?status ?leaveType)
 *   GET    /api/leaves/:id    → getSingleLeave
 *   POST   /api/leaves        → createLeave
 *   PUT    /api/leaves/:id    → updateLeaveStatus
 *   DELETE /api/leaves/:id    → deleteLeave
 */

const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getAllLeaves, getSingleLeave, createLeave, updateLeaveStatus, deleteLeave } = require('../controllers/leaveController');

router.get('/',       protect, adminOnly, getAllLeaves);
router.get('/:id',    protect, adminOnly, getSingleLeave);
router.post('/',      protect, adminOnly, createLeave);
router.put('/:id',    protect, adminOnly, updateLeaveStatus);
router.delete('/:id', protect, adminOnly, deleteLeave);

module.exports = router;
/* END — File: routes/leaveRoutes.js  Mounted: /api/leaves */
