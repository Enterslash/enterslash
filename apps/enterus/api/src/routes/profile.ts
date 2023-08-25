import router from "express"
import { userAuthorization } from "../middleware/authorization";
import { editMyProfile, getMyProfile, getUserProfile } from "../controllers/profile";
import { parseFile } from "../middleware/fileParser";
import { profileValidator } from "../middleware/validation/profileValidator";

const profileRouter = router.Router();

profileRouter.get("/profile/me", userAuthorization, getMyProfile);
profileRouter.get("/profile/:id", getUserProfile);
profileRouter.put("/profile/", [userAuthorization, parseFile, profileValidator], editMyProfile);


export default profileRouter;
