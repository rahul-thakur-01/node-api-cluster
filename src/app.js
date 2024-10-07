import express from 'express';
import bodyParser from 'body-parser';
import taskRouter from './routes/task.js';

const app = express();

app.use(bodyParser.json());


app.use('/api/v1/task', taskRouter);


app.get('/health', (req, res) => {
  res.status(200).send('API is healthy');
});

export default app;