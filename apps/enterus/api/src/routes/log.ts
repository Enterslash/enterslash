import router from 'express';
import { getAllLog } from '../controllers/log';

const logRouter = router.Router();
logRouter.get('/log', getAllLog);

export default logRouter;
