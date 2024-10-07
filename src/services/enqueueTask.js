import taskQueue from '../queues/taskQueue.js';

import taskWorker from '../workers/taskWorker.js';
import dlqWorker  from '../workers/dlqWorker.js';

export const enqueueTask = async (user_id) => {
  try {
    await taskQueue.add('process-task', { user_id });
  } catch (error) {
    console.error('Error while enqueueing task:', error);
  }
};


