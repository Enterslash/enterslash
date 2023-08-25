import router from "express"
import { getServiceRequests, handleServiceRequest } from "../../controllers/admin/request";

const adminRequestRouter = router.Router();

adminRequestRouter.get("/requests", getServiceRequests);
adminRequestRouter.put("/request", handleServiceRequest);

export default adminRequestRouter;
