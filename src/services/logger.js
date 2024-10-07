import path from 'path';
import { fileURLToPath } from 'url';
import { createLogger, transports, format } from 'winston';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.resolve(__dirname, '../../logs/error.log') }),
  ],
});

export default logger;