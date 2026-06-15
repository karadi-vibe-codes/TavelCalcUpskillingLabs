export function errorHandler(err, _req, res, _next) {
  console.error(err.stack);

  // MongoDB invalid ObjectId
  if (err.message?.includes('BSONError') || err.name === 'BSONError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
