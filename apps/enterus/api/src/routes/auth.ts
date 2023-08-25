import router from "express"
import { login, logout, registration } from "../controllers/auth";
import { loginValidator, registrationValidator } from "../middleware/validation/authValidator";
import { userAuthorization } from "../middleware/authorization";

const authRouter = router.Router();

authRouter.post("/auth/login", loginValidator, login);
authRouter.post("/auth/registration", registrationValidator, registration);
authRouter.post("/auth/logout", userAuthorization, logout);

export default authRouter;
