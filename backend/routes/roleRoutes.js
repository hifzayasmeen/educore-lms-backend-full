const express = require('express');
const router = express.Router();
const { getRoles, assignRole, getUsersWithRoles } = require('../controllers/roleController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get list of all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 */
router.get('/', authenticate, getRoles);

/**
 * @swagger
 * /api/roles/users:
 *   get:
 *     summary: Get all users with their roles (Admin or Team Lead only)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users with roles
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get('/users', authenticate, authorize('Admin', 'Team Lead'), getUsersWithRoles);

/**
 * @swagger
 * /api/roles/assign:
 *   put:
 *     summary: Assign a role to a user (Admin or Team Lead only)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.put('/assign', authenticate, authorize('Admin', 'Team Lead'), assignRole);

module.exports = router;