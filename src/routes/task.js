import express from 'express';
import { enqueueTask } from '../services/enqueueTask.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ message: 'user_id is required' });
  }
  try {
    await enqueueTask(user_id);
    return res.status(202).json({ message: 'Task has been queued for processing.' });
  } catch (error) {
    console.error('Error enqueueing task:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;