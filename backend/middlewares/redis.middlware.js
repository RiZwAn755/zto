import {Redis} from "ioredis";

const redis = new Redis({
    host: 'redis-16352.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 16352,
    password: 'M2L1nPscU6PMBOlXgNMnJp43AQgcvyvN',
  });

  const cachedData = (key) => {

   return  async(req,res,next)=>{

    const data = await redis.get(key);

    if(data){
           res.send({key:JSON.parse(data)});
    }
    else 
    {
        next();
    }
  }
}

export default cachedData;