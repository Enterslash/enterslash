import router from "express"
import { userAuthorization } from "../middleware/authorization";
import { deleteAccount } from "../controllers/user";

const userRouter = router.Router();

userRouter.post("/user/account/delete", userAuthorization, deleteAccount);

export default userRouter;
