import router from "express"
import { userAuthorization } from "../middleware/authorization";
import { getConversations, getMessages } from "../controllers/message";

const messageRouter = router.Router();

messageRouter.get("/message/:bookingId", userAuthorization, getMessages);
messageRouter.get("/conversations", userAuthorization, getConversations);


export default messageRouter;
