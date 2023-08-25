import router from "express"
import { createService, editService, deleteService, changeServiceStatus, getAllService } from "../../controllers/admin/service";
import { serviceValidator } from "../../middleware/validation/serviceValidator";
import { parseFile } from "../../middleware/fileParser";
import { userAuthorization } from "../../middleware/authorization";

const adminServiceRouter = router.Router();

adminServiceRouter.get("/services", userAuthorization, getAllService);
adminServiceRouter.post("/service", [parseFile, serviceValidator], createService);
adminServiceRouter.put("/service/:id", [parseFile, serviceValidator], editService);
adminServiceRouter.put("/service/:id/status", changeServiceStatus);
adminServiceRouter.delete("/service/:id", deleteService);

export default adminServiceRouter;
