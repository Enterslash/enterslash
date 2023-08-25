import router from "express"
import { userAuthorization } from "../middleware/authorization";
import { createMessage, getConversations, getLatestMessages, getMessages } from "../controllers/message";
import { parseFile } from "../middleware/fileParser";

const messageRouter = router.Router();

messageRouter.post("/message", [parseFile, userAuthorization], createMessage);
messageRouter.get("/message/:bookingId", userAuthorization, getMessages);
messageRouter.post("/message/:bookingId/latest", userAuthorization, getLatestMessages);
messageRouter.get("/conversations", userAuthorization, getConversations);


export default messageRouter;
