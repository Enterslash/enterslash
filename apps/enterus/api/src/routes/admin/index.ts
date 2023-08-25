import router from "express"
import { userAuthorization } from "../../middleware/authorization";
import adminServiceRouter from "./service";
import adminCategoryRouter from "./category";
import adminRequestRouter from "./request";
import adminProviderRouter from "./provider";
import adminProviderRequestRouter from "./providerRequest";
import adminDashboardRouter from "./dashboard";

const adminRouter = router.Router();

adminRouter.use("/", userAuthorization, adminServiceRouter);
adminRouter.use("/", userAuthorization, adminCategoryRouter);
adminRouter.use("/", userAuthorization, adminRequestRouter);
adminRouter.use("/", userAuthorization, adminProviderRouter);
adminRouter.use("/", userAuthorization, adminProviderRequestRouter);
adminRouter.use("/", userAuthorization, adminDashboardRouter);

export default adminRouter;
