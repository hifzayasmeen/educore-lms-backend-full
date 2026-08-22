require('dotenv').config();
const cors = require('cors');

const analyticsRoutes = require('./routes/analyticsRoutes');
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const reviewRoutes = require('./routes/reviewRoutes');

const notificationRoutes = require('./routes/notificationRoutes');
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const certificateRoutes = require('./routes/certificateRoutes');

const app = express();
app.use(express.json());
app.use(logger);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
}));

// Rate Limiter: ek IP se 15 minute mein max 100 requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Bohot zyada requests bhej di aapne, thodi der baad try karo' }
});

app.use(limiter);

// Generated certificates ko browser se access karne ke liye
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

app.post('/testpost', (req, res) => {
  res.json({ message: 'POST bhi kaam kar raha hai!', body: req.body });
});

// Certificate routes
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', roleRoutes);
app.get('/', (req, res) => {
  res.send('Certificate API is running 🚀');
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server chal raha hai: http://localhost:${PORT}`);
  });
}

module.exports = app;


app.use(errorHandler);
