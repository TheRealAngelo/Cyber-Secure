exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];
  
  console.error(`[ERROR] ${statusCode} - ${message}`, err);
  
  // Security: Don't leak stack traces in production
  const stack = process.env.NODE_ENV === 'development' ? err.stack : null;
  
  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    stack
  });
};