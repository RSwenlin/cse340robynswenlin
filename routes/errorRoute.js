const express = require('express');
const router = new express.Router();

// Controller to intentionally trigger an error
router.get('/trigger-error', (req, res, next) => {
  // This is where we intentionally throw an error
  const error = new Error('This is an intentional server error.');
  error.status = 500;
  next(error);  // Pass the error to the error handling middleware
});

module.exports = router;
