import {  Worker } from 'bullmq';
import { task } from '../services/taskService.js';
import logger from '../services/logger.js';
import deadLetterQueue from '../queues/deadLetterQueue.js';

const dlqWorker = new Worker('dead-letter-queue', async (job) => {
  const { user_id } = job.data;
  try {
    console.log(`Retrying job for user ID: ${user_id} from dead letter queue`);
    await task(user_id);
    console.log(`Job for user ID ${user_id} completed successfully from DLQ.`);
  } catch (error) {
    console.error('Error processing DLQ task:', error);
    throw new Error('DLQ Job failed');
  }
}, {
  connection: deadLetterQueue.client,
});


dlqWorker.on('failed', async (job, err) => {
  console.error(`DLQ Job ${job.id} failed with error: ${err.message}`);
  logger.error(`DLQ Job ${job.id} failed after retrying. User ID: ${job.data.user_id}`, {
    error: err.message,
    jobData: job.data,
  });
});

export default dlqWorker;