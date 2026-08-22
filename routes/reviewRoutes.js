const express = require('express');
const router = express.Router();
const {
  listPendingSubmissions,
  approveSubmission,
  rejectSubmission,
} = require('../controllers/reviewController');

router.get('/pending', listPendingSubmissions);
router.put('/:id/approve', approveSubmission);
router.put('/:id/reject', rejectSubmission);

module.exports = router;