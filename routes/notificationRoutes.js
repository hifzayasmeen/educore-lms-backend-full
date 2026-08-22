const express = require('express');
const router = express.Router();
const {
  createNotification,
  listNotifications,
  markAsRead,
  markAsUnread,
  getUnreadSummary,
} = require('../controllers/notificationController');

router.post('/', createNotification);
router.get('/:studentId/unread-summary', getUnreadSummary);
router.get('/:studentId', listNotifications);
router.put('/:id/read', markAsRead);
router.put('/:id/unread', markAsUnread);

module.exports = router;