const express = require('express');
const upload = require('../middleware/upload');
const router = express.Router();
const { createSubmission, getSubmissionsByAssignment, gradeSubmission } = require('../controllers/submissionController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/submissions:
 *   post:
 *     summary: Submit an assignment (student upload)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Submission created successfully
 */
router.post('/', authenticate, upload.single('file'), createSubmission);

/**
 * @swagger
 * /api/submissions/assignment/{assignmentId}:
 *   get:
 *     summary: Get all submissions for an assignment (Instructor, Team Lead, or Admin only)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of submissions
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get('/assignment/:assignmentId', authenticate, authorize('Instructor', 'Team Lead', 'Admin'), getSubmissionsByAssignment);

/**
 * @swagger
 * /api/submissions/{id}/grade:
 *   put:
 *     summary: Grade a submission (Instructor, Team Lead, or Admin only)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grade:
 *                 type: number
 *               feedback:
 *                 type: string
 *     responses:
 *       200:
 *         description: Submission graded successfully
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.put('/:id/grade', authenticate, authorize('Instructor', 'Team Lead', 'Admin'), gradeSubmission);

module.exports = router;