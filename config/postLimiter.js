const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
  points: 1,
  duration: 120,
});

function rateLimiterMiddleware(req, res, next) {
  rateLimiter.consume(req.ip) 
    .then(() => {
      next(); 
    })
    .catch(() => {
      res.status(429).send('Rate limit exceeded'); 
    });
}

module.exports = rateLimiterMiddleware;