import router from "express"
import stripeHookRouter from "./stripe";

const webhookRouter = router.Router();

webhookRouter.use("/stripe", stripeHookRouter);

export default webhookRouter;
