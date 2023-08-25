import { logger } from "../../middleware/logger/logger";
import Category from "../../models/Category";
import { success, failed } from "../../utils/response";
import { CreateCategoryDTO, IAuthRequest } from "@enterslash/enterus/types";

export const createCategory = async (req: IAuthRequest<CreateCategoryDTO>, res, next) => {
    try {
        const { name } = req.body;
        const category = await Category.create({
            name
        });
        res.status(201).json(success({ data: category }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const editCategory = async (req: IAuthRequest<CreateCategoryDTO, { id: string }>, res, next) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await Category.findOneAndUpdate({ _id: id }, {
            name
        }, { new: true })
        res.status(201).json(success({ data: category }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const deleteCategory = async (req: IAuthRequest<null, { id: string }>, res, next) => {
    try {
        const { id } = req.params;
        await Category.deleteOne({ _id: id });
        res.status(201).json(success({ message: "Category deleted successfully" }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};