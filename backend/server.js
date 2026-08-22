
 const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
console.log(JSON.stringify(swaggerSpec, null, 2));
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');


const courseRoutes = require('./routes/courseRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const submissionRoutes = require('./routes/submissionRoutes');
const pool = require('./config/db');
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'EduCore LMS Backend is running.' });
});

// Test DB connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/roles', roleRoutes);
app.use('/api/courses', courseRoutes);

app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
