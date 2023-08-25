import { GetCategoryDTO } from "@enterslash/enterus/types";
import $api from "./client";

export const get_categories = () : Promise<GetCategoryDTO[]> => {
    return  $api.get('/categories');
}