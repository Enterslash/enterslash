import { Document } from "mongoose";
import { ICategoryModel } from "./Category";

export type PriceInputType = 'number' | 'select' | 'radio';

export enum ServiceStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface IPriceInputs {
    name: string,
    label: string,
    unite: string,
    defaultValue: number,
}

export interface IService {
    title: string,
    description: string,
    cover: string,
    category: ICategoryModel[],
    priceInputs: IPriceInputs[],
    status: ServiceStatus,
}

export interface IServiceModel extends IService, Document { }