const express = require('express');
const router = express.Router();
const {
  getStudentProgress,
  getCourseCompletionRate,
} = require('../controllers/analyticsController');

router.get('/student/:studentId', getStudentProgress);
router.get('/course/:courseId', getCourseCompletionRate);

module.exports = router;