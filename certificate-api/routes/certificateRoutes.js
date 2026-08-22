const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  listCertificates,
  verifyCertificate,
} = require('../controllers/certificateController');

router.post('/generate', generateCertificate);
router.get('/verify/:code', verifyCertificate);
router.get('/:studentId', listCertificates);

module.exports = router;