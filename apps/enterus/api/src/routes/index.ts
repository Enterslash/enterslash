import router from 'express';
import authRouter from './auth';
import profileRouter from './profile';
import messageRouter from './message';
import webhookRouter from '../webhook';
import appRouter from './app';
import notificationRouter from './notification';
import userRouter from './user';
import logRouter from './log';
import roomRouter from './room';

const rootRouter = router.Router();

rootRouter.use('/', authRouter);
rootRouter.use('/', profileRouter);
rootRouter.use('/', messageRouter);
rootRouter.use('/', appRouter);
rootRouter.use('/', notificationRouter);
rootRouter.use('/', userRouter);
rootRouter.use('/', logRouter);
rootRouter.use('/', roomRouter);

rootRouter.use('/webhook', webhookRouter);

export default rootRouter;
