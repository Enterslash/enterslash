import winston from 'winston';
import 'winston-mongodb';

const MongoTransport = new winston.transports.MongoDB({
  db: process.env["MONGODB_URI"],
  collection: 'logs',
  options: { useUnifiedTopology: true },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

const ConsoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
});

export const logger = winston.createLogger({
  transports: [
    ConsoleTransport,
    MongoTransport,
  ],
});

// if (process.env.NODE_ENV !== 'production') {
//   logger.remove(MongoTransport);
// }