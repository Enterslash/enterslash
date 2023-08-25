import router from "express"
import { assignService, getAllProviders } from "../../controllers/admin/provider";

const adminProviderRouter = router.Router();

adminProviderRouter.get("/providers", getAllProviders);
adminProviderRouter.post("/provider/assign", assignService);

export default adminProviderRouter;
