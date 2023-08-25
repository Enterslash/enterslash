import { CreateCategoryDTO, GetCategoryDTO, ICategoryModel } from "@enterslash/enterus/types";
import $api from "../client";

export const create_category = (data: CreateCategoryDTO) : Promise<ICategoryModel> => {
    return  $api.post('/admin/category', data);
}

export const edit_category = (id: string, data: CreateCategoryDTO) : Promise<ICategoryModel> => {
    return  $api.put(`/admin/category/${id}`, data);
}

export const delete_category = (id: string) : Promise<ICategoryModel> => {
    return  $api.delete(`/admin/category/${id}`);
}