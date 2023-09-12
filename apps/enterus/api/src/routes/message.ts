import router from "express"
import { userAuthorization } from "../middleware/authorization";
import { getMessages } from "../controllers/message";

const messageRouter = router.Router();

messageRouter.get("/message/:roomId", userAuthorization, getMessages);

export default messageRouter;
