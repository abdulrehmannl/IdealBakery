/**
 * routes/attendanceRoutes.js — Attendance API Routes
 * ====================================================
 * Mounted: app.use('/api/attendance', attendanceRoutes)
 * All routes: Admin/Manager only
 *
 *   GET    /api/attendance        → getAllAttendance  (?staff ?status ?dateFrom ?dateTo)
 *   GET    /api/attendance/:id    → getSingleAttendance
 *   POST   /api/attendance        → markAttendance
 *   PUT    /api/attendance/:id    → updateAttendance
 *   DELETE /api/attendance/:id    → deleteAttendance
 */

const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getAllAttendance, getSingleAttendance, markAttendance, updateAttendance, deleteAttendance } = require('../controllers/attendanceController');

router.get('/',       protect, adminOnly, getAllAttendance);
router.get('/:id',    protect, adminOnly, getSingleAttendance);
router.post('/',      protect, adminOnly, markAttendance);
router.put('/:id',    protect, adminOnly, updateAttendance);
router.delete('/:id', protect, adminOnly, deleteAttendance);

module.exports = router;
/* END — File: routes/attendanceRoutes.js  Mounted: /api/attendance */
