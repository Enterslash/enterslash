import router from "express"
import { userAuthorization } from "../../middleware/authorization";
import providerServiceRouter from "./service";
import providerBookingRouter from "./bookoings";

const providerRouter = router.Router();

providerRouter.use("/", userAuthorization, providerServiceRouter);
providerRouter.use("/", userAuthorization, providerBookingRouter);


export default providerRouter;
