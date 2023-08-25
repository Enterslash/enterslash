import router from "express"
import { getCategories } from "../controllers/category";

const categoryRouter = router.Router();

categoryRouter.get("/categories", getCategories);

export default categoryRouter;
