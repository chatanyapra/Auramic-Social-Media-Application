import rateLimit from 'express-rate-limit';

export const geminiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // limit each IP to 15 requests per windowMs
  message: 'Too many requests to Gemini API, please try again later',
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded for Gemini API',
      retryAfter: '1 minute'
    });
  }
});