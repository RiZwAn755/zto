import redis from "../DB/redis.js";

  const cachedData = (key) => {

   return  async(req,res,next)=>{

    const data = await redis.get(key);

    if(data){
      console.log("response from redis");
           res.json(JSON.parse(data));
    }
    else 
    {
        next();
    }
  }
}

export default cachedData;