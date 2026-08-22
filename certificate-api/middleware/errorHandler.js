const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);
  console.error(err.stack);

  res.status(500).json({
    error: 'Kuch galat ho gaya, please dobara try karein.',
  });
};

module.exports = errorHandler;