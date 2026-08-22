const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// Step 1: Certificate PDF generate karne ka helper function
function createCertificatePDF(studentName, courseName, certificateCode, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Simple certificate design
    doc.fontSize(30).text('Certificate of Completion', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(18).text('This certifies that', { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(24).text(studentName, { align: 'center', underline: true });
    doc.moveDown(1);
    doc.fontSize(18).text('has successfully completed the course', { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(22).text(courseName, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).text(`Verification Code: ${certificateCode}`, { align: 'center' });
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve());
    stream.on('error', (err) => reject(err));
  });
}

// POST /api/certificates/generate
exports.generateCertificate = async (req, res) => {
  try {
    const { student_id, course_id } = req.body;

    if (!student_id || !course_id) {
      return res.status(400).json({ error: 'student_id aur course_id zaroori hain' });
    }

    // Student aur course ka naam nikalo
    const studentResult = await pool.query('SELECT name FROM students WHERE id = $1', [student_id]);
    const courseResult = await pool.query('SELECT title FROM courses WHERE id = $1', [course_id]);

    if (studentResult.rows.length === 0 || courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Student ya course nahi mila' });
    }

    const studentName = studentResult.rows[0].name;
    const courseName = courseResult.rows[0].title;

    // Unique certificate code banao
    const certificateCode = uuidv4().split('-')[0].toUpperCase();
    const fileName = `certificate_${student_id}_${course_id}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '..', 'uploads', 'certificates', fileName);

    // PDF generate karo
    await createCertificatePDF(studentName, courseName, certificateCode, filePath);

    const certificateUrl = `/uploads/certificates/${fileName}`;

    // Database mein save karo
    const insertResult = await pool.query(
      `INSERT INTO certificates (student_id, course_id, certificate_code, certificate_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [student_id, course_id, certificateCode, certificateUrl]
    );

    res.status(201).json({
      message: 'Certificate successfully generate hua',
      certificate: insertResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// GET /api/certificates/:studentId
exports.listCertificates = async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await pool.query(
      `SELECT c.id, c.certificate_code, c.certificate_url, c.issued_at, co.title AS course_name
       FROM certificates c
       JOIN courses co ON c.course_id = co.id
       WHERE c.student_id = $1
       ORDER BY c.issued_at DESC`,
      [studentId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// GET /api/certificates/verify/:code
exports.verifyCertificate = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query(
      `SELECT c.certificate_code, c.issued_at, s.name AS student_name, co.title AS course_name
       FROM certificates c
       JOIN students s ON c.student_id = s.id
       JOIN courses co ON c.course_id = co.id
       WHERE c.certificate_code = $1`,
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ valid: false, message: 'Certificate nahi mila' });
    }

    res.json({ valid: true, certificate: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
