import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import cors from 'cors';
import { connectDatabase } from './config/database';
import { createSocket } from './config/socket';
import rootRouter from './routes';
import { messageListener } from './listeners';
import { notificationListener } from './listeners/notification';
import { logger } from './middleware/logger/logger';

const app = express();
const server = http.createServer(app);

// Middleware
const middleware = [
  cors(),
  morgan((tokens, req, res) => {
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const status = tokens.status(req, res);
    const message = `${method} ${url} ${status}`;
    if (url.includes("/log")) {
      return null
    }
    if (status > 300 && status < 400) {
      logger.warn(message);
    } else if (status >= 400) {
      logger.error(message);
    } else {
      logger.info(message);
    }
    return null;
  }),
  express.json(),
  express.urlencoded({ extended: false }),
];
app.use(middleware);
// Middleware

connectDatabase();
createSocket(server, (io, socket) => {
  messageListener(io, socket);
  notificationListener(io, socket);
});

//Use Routes
app.use('/api', rootRouter);
//Use Routes

//error handling
app.use((req, res, next) => {
  const error = new Error('Not found');
  (error as any).status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  logger.error(error.message);
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
//error handling

//serve app
const port = process.env.PORT || 9090;
server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
//serve app
