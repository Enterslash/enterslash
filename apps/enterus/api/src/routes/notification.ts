import router from "express"
import { userAuthorization } from "../middleware/authorization";
import { getNotifications } from "../controllers/notification";

const notificationRouter = router.Router();

notificationRouter.get("/notifications", userAuthorization, getNotifications);

export default notificationRouter;
