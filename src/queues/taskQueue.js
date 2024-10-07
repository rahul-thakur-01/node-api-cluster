import {Queue} from 'bullmq';
import redisClient from '../services/redisClient.js';


const taskQueue = new Queue('task-queue', {
  connection: redisClient,
  limiter: {
    max: 1, 
    duration: 1000,
  },
});

export default taskQueue;




