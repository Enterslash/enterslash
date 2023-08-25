import router from "express"
import { getAllService, getServiceProviders, getSingleService } from "../controllers/service";

const serviceRouter = router.Router();

serviceRouter.get("/services", getAllService);
serviceRouter.get("/service/:id", getSingleService);
serviceRouter.get("/service/:id/providers", getServiceProviders);

export default serviceRouter;
