import {Redis} from "ioredis";
const redis = new Redis({

    host: 'redis-16352.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 16352,
    password: 'M2L1nPscU6PMBOlXgNMnJp43AQgcvyvN',

});

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