import router from "express"
import { allMyServiceRequest, changeServiceStatus, singleServiceRequest, startService } from "../../controllers/provider/service";
import { serviceRequestValidator } from "../../middleware/validation/requestValidator";

const serviceRouter = router.Router();

serviceRouter.get("/service_requests", allMyServiceRequest);
serviceRouter.get("/service_request/:id", singleServiceRequest);
serviceRouter.post("/service/:id/start", serviceRequestValidator, startService);
serviceRouter.put("/service_request/:id/:status", changeServiceStatus);

export default serviceRouter;
