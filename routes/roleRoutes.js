const express = require('express');
const router = express.Router();
const { getRoles, getUsersWithRoles, assignRole } = require('../controllers/roleController');

router.get('/roles', getRoles);
router.get('/users-with-roles', getUsersWithRoles);
router.put('/assign-role', assignRole);

module.exports = router;