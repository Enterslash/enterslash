import router from "express"
import { getRoomIdentifiers, getRooms, getSingleRoom, joinRoom } from "../controllers/room";
import { userAuthorization } from "../middleware/authorization";
import { roomValidator } from "../middleware/validation/roomValidator";
const roomRouter = router.Router();

roomRouter.get("/room/identifiers", getRoomIdentifiers);
roomRouter.get("/rooms", userAuthorization, getRooms);
roomRouter.get("/room/:roomId", userAuthorization, getSingleRoom);
roomRouter.post("/room/join", [userAuthorization, roomValidator], joinRoom);

export default roomRouter;
