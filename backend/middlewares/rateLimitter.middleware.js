import redis from "../DB/redis.js";

 const rateLimitter = ({limit , time , key}) =>{

   return  async (req , resp , next) =>{

        const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        const redisKey = `${clientIp}:request_count`;

        const counter = await redis.incr(redisKey);

        if(counter === 1){ // set the timer = time

           await redis.expire(redisKey , time);

        }

        const timeLeft = await redis.ttl(redisKey);

        if(counter > limit){

            return resp.status(429).send(`you reached the requestLimit, Try again in ${timeLeft} seconds`);
        }
          next();
    }
    
  
};

export default rateLimitter ;