const express = require('express');
const router = express.Router();
const { createCourse, getCourses, updateCourse, deleteCourse } = require('../controllers/courseController');
const { validateCourse } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get('/', authenticate, getCourses);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course (Instructor, Team Lead, or Admin only)
 *     tags: [Courses]
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
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.post('/', authenticate, authorize('Instructor', 'Team Lead', 'Admin'), validateCourse, createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course (Instructor, Team Lead, or Admin only)
 *     tags: [Courses]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.put('/:id', authenticate, authorize('Instructor', 'Team Lead', 'Admin'), validateCourse, updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course (Instructor, Team Lead, or Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.delete('/:id', authenticate, authorize('Instructor', 'Team Lead', 'Admin'), deleteCourse);

module.exports = router;