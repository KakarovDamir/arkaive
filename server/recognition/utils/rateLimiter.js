const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Слишком много запросов с этого IP, пожалуйста попробуйте снова через 15 минут',
  headers: true,
});

module.exports = limiter;
