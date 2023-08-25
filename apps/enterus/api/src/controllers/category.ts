import { IAuthRequest } from "@enterslash/enterus/types";
import Category from "../models/Category";
import { success, failed } from "../utils/response";
import { logger } from "../middleware/logger/logger";

export const getCategories = async (req: IAuthRequest, res, next) => {
    try {
        const categories = await Category.find({});
        res.status(201).json(success({ data: categories }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};