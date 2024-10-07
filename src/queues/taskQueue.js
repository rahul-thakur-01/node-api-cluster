import {Queue} from 'bullmq';
import redisClient from '../services/redisClient.js';


const taskQueue = new Queue('task-queue', {
  connection: redisClient,
});

export default taskQueue;




