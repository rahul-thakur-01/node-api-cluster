import { Worker } from 'bullmq';
import { task } from '../services/taskService.js';
import logger from '../services/logger.js';
import taskQueue from '../queues/taskQueue.js';
import deadLetterQueue from '../queues/deadLetterQueue.js';
import { isUnderLimit } from '../utils/rateLimiter.js'; // Import the rate limiter

const taskWorker = new Worker('task-queue', async (job) => {
  const { user_id } = job.data;

  try {
    const underLimit = await isUnderLimit(user_id);

    if (underLimit) {
      logger.info(`Processing job for user ID: ${user_id}`);
      try {
        await task(user_id);
        logger.info(`Job for user ID ${user_id} completed.`);
      } catch (error) {
        logger.error('Error processing task:', { error: error.message, user_id });
        throw new Error('Job failed'); 
      }
    } else {
      logger.warn(`User ID ${user_id} has exceeded the rate limit. Requeuing job.`);
      await taskQueue.add('process-task', { user_id }, { delay: 60000 });
    }
  } catch (error) {
    logger.error('Rate Limiter Error:', { error: error.message, user_id });
    throw new Error('Rate Limiter Failure'); 
  }
}, {
  connection: taskQueue.client,
});

taskWorker.on('failed', async (job, err) => {
  logger.error(`Job ${job.id} failed with error: ${err.message}`);

  if (err.message === 'Job failed' || err.message === 'Rate Limiter Failure') {
    logger.info(`Moving job ${job.id} to dead letter queue.`);
    await deadLetterQueue.add('dead-letter-task', { user_id: job.data.user_id });

    try {
      logger.error(`Job ${job.id} failed. User ID: ${job.data.user_id}`, {
        error: err.message,
        jobData: job.data,
      });
    } catch (logError) {
      logger.error('Error logging to logger:', { error: logError.message });
    }
  } else {
    logger.error(`Job ${job.id} failed with an unexpected error: ${err.message}`);
  }
});

export default taskWorker;


// import {  Worker } from 'bullmq';
// import { task } from '../services/taskService.js';
// import logger from '../services/logger.js';
// import taskQueue from '../queues/taskQueue.js';
// import deadLetterQueue from '../queues/deadLetterQueue.js';


// const taskWorker = new Worker('task-queue', async (job) => {
//   const { user_id } = job.data;
//   console.log("asdfsfd");
//   return ;

//   if (!taskWorker.userRequestTimestamps) {
//     taskWorker.userRequestTimestamps = {};
//   }

//   const currentTime = Date.now();
//   const MAX_TASKS_PER_MINUTE = 5;

//   if (!taskWorker.userRequestTimestamps[user_id]) {
//     taskWorker.userRequestTimestamps[user_id] = [];
//   }

//   taskWorker.userRequestTimestamps[user_id] = taskWorker.userRequestTimestamps[user_id].filter(timestamp => (currentTime - timestamp) < 60000);

//   if (taskWorker.userRequestTimestamps[user_id].length < MAX_TASKS_PER_MINUTE) {
//     taskWorker.userRequestTimestamps[user_id].push(currentTime);
//     console.log(`Processing job for user ID: ${user_id}`);

//     try {
//       await task(user_id);
//       console.log(`Job for user ID ${user_id} completed.`);
//     } catch (error) {
//       console.error('Error processing task:', error);
//       throw new Error('Job failed'); // Mark job as failed
//     }
//   }
//   else {
//     console.log(`Job for user ID ${user_id} added to pending tasks due to rate limit.`);
    
//     const delay = 60000;
//     await taskQueue.add('process-task', { user_id }, { delay });
//   }
// }, {
//   connection: taskQueue.client,
// });

// taskWorker.on('failed', async (job, err) => {
//   console.error(`Job ${job.id} failed with error: ${err.message}`);

//   if (err.message === 'Job failed') {
//     console.log(`Moving job ${job.id} to dead letter queue.`);
//     await deadLetterQueue.add('dead-letter-task', { user_id: job.data.user_id });

//     try {
//       logger.error(`Job ${job.id} failed due to rate limiting. User ID: ${job.data.user_id}`, {
//         error: err.message,
//         jobData: job.data,
//       });
//     } catch (logError) {
//       console.error('Error logging to logger:', logError);
//     }
//   } else {
//     console.log(`Job ${job.id} failed with an error: ${err.message}`);
//   }
// });

// export default taskWorker;