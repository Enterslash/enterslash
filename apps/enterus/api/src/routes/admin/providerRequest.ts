import router from "express"
import { getAllProviderRequest, handleProviderRequest } from "../../controllers/admin/providerRequest";

const adminProviderRequestRouter = router.Router();

adminProviderRequestRouter.get("/provider_requests", getAllProviderRequest);
adminProviderRequestRouter.put("/provider_request/:id", handleProviderRequest);

export default adminProviderRequestRouter;
