import { DTO } from ".";
import { ICategoryModel } from "../models";

export type CreateCategoryDTO = DTO<ICategoryModel, {
    name: string
}>

export type GetCategoryDTO = DTO<ICategoryModel, {
    _id: string
    name: string,
}>