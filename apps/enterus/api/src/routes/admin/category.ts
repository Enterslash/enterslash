import router from "express"
import { createCategory, editCategory, deleteCategory } from "../../controllers/admin/category";

const adminCategoryRouter = router.Router();

adminCategoryRouter.post("/category", createCategory);
adminCategoryRouter.put("/category/:id", editCategory);
adminCategoryRouter.delete("/category/:id", deleteCategory);

export default adminCategoryRouter;
