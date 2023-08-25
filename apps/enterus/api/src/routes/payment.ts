import router from "express"
import { getStripeSheetInfo, initializePayment } from "../controllers/payment";
import { userAuthorization } from "../middleware/authorization";

const paymentRouter = router.Router();

paymentRouter.get("/payment/stripe/cards", userAuthorization, getStripeSheetInfo);
paymentRouter.post("/payment/stripe/pay-init", userAuthorization, initializePayment);

export default paymentRouter;
