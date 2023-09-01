import router from "express"
import { getRoomIdentifiers } from "../controllers/room";
const roomRouter = router.Router();

roomRouter.get("/room/identifiers", getRoomIdentifiers);

export default roomRouter;
