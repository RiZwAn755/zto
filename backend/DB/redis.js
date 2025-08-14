
import {Redis} from "ioredis";
const redis = new Redis({
      host: 'redis-16352.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
      port: 16352,
      password: 'M2L1nPscU6PMBOlXgNMnJp43AQgcvyvN',
});

export default redis; 