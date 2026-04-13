import redis from "../DB/redis.js";

const rateLimiter = ({ limit, time}) => {
  return async (req, resp, next) => {
    try {
      const userId = req.user?._id; // user id from auth middleware

      if (!userId) {
        return resp.status(401).send("Unauthorized: User not logged in");
      }

      const redisKey = `${userId}:request_count`; // unique key per user

      const counter = await redis.incr(redisKey);

      if (counter === 1) {
        await redis.expire(redisKey, time);
      }

      if (counter > limit) {
        const timeLeft = await redis.ttl(redisKey);
        return resp
          .status(429)
          .send(`You reached the request limit. Try again in ${timeLeft} seconds`);
      }

      next();
    } catch (err) {
      console.log("Rate limiter error (Redis issue):", err?.message || err);

      // block request if redis fails (strict mode)
      return resp.status(503).json({
        success: false,
        message: "Service temporarily unavailable. Please try again.",
      });
    }
  };
};

export default rateLimiter;
