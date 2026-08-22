const express = require('express');
const router = express.Router();
const { createAssignment, getAssignmentsByCourse } = require('../controllers/assignmentController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/assignments:
 *   post:
 *     summary: Create a new assignment (Instructor, Team Lead, or Admin only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               courseId:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.post('/', authenticate, authorize('Instructor', 'Team Lead', 'Admin'), createAssignment);

/**
 * @swagger
 * /api/assignments/course/{courseId}:
 *   get:
 *     summary: Get all assignments for a specific course
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of assignments
 */
router.get('/course/:courseId', authenticate, getAssignmentsByCourse);

module.exports = router;