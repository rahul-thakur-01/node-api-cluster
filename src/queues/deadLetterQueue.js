import {Queue} from 'bullmq';
import redisClient from '../services/redisClient.js';


const deadLetterQueue = new Queue('dead-letter-queue', {
  connection: redisClient,
});

export default deadLetterQueue;


