import path from 'path';
import { fileURLToPath } from 'url';
import { createLogger, transports, format } from 'winston';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const logLevel = process.env.LOG_LEVEL || 'info';

const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss' 
    }),
    format.json() 
  ),
  transports: [
    new transports.Console(), 
    new transports.File({ 
      filename: path.resolve(__dirname, '../../logs/error.log'), 
      level: 'error' 
    }),
    new transports.File({ 
      filename: path.resolve(__dirname, '../../logs/info.log'), 
      level: logLevel 
    }),
  ],
});

export default logger;