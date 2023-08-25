import router from 'express';
import authRouter from './auth';
import bookingRouter from './booking';
import profileRouter from './profile';
import serviceRouter from './service';
import adminRouter from './admin';
import providerRouter from './provider';
import categoryRouter from './category';
import messageRouter from './message';
import paymentRouter from './payment';
import webhookRouter from '../webhook';
import appRouter from './app';
import providerRequestRouter from './providerRequest';
import notificationRouter from './notification';
import userRouter from './user';
import blogRouter from './blogs';
import logRouter from './log';

const rootRouter = router.Router();

rootRouter.use('/', authRouter);
rootRouter.use('/', profileRouter);
rootRouter.use('/', serviceRouter);
rootRouter.use('/', bookingRouter);
rootRouter.use('/', bookingRouter);
rootRouter.use('/', bookingRouter);
rootRouter.use('/', categoryRouter);
rootRouter.use('/', messageRouter);
rootRouter.use('/', paymentRouter);
rootRouter.use('/', appRouter);
rootRouter.use('/', providerRequestRouter);
rootRouter.use('/', notificationRouter);
rootRouter.use('/', userRouter);
rootRouter.use('/', blogRouter);
rootRouter.use('/', logRouter);

rootRouter.use('/admin', adminRouter);
rootRouter.use('/provider', providerRouter);
rootRouter.use('/webhook', webhookRouter);

export default rootRouter;
