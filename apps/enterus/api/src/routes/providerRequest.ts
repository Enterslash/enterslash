import router from "express"
import { userAuthorization } from "../middleware/authorization";
import { getMyProviderRequest, requestToBeProvider } from "../controllers/providerRequest";
import { parseFile } from "../middleware/fileParser";
import { providerRequestValidator } from "../middleware/validation/providerRequestValidator";

const providerRequestRouter = router.Router();

providerRequestRouter.post("/provider_request", [userAuthorization, parseFile, providerRequestValidator], requestToBeProvider);
providerRequestRouter.get("/provider_request", userAuthorization, getMyProviderRequest);

export default providerRequestRouter;
