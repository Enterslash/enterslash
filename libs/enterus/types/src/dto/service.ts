import { DTO } from ".";
import { ICategoryModel, IPriceInputs, IService, IServiceModel, IUserModel, ProviderServiceStatus, ServiceStatus } from "../models";

export type HandleServiceRequestDTO = {
    providerId: string,
    serviceId: string,
    status: ProviderServiceStatus,
}

export type CreateServiceDTO = DTO<IService, {
    title: string,
    description: string,
    cover: Blob,
    category: string,
    priceInputs: string
}>

export type ChangeServiceStatusDTO = DTO<IService, {
    status: ServiceStatus,
}>

export type GetProviderDTO = DTO<IUserModel, {
    _id: string,
    firstName: string,
    lastName: string,
    avatar: string,
    location: string,
}>

export type GetMultiServicesDTO = DTO<IServiceModel, {
    _id: string,
    title: string,
    description: string,
    cover: string,
    status: IServiceModel["status"],
    category: IServiceModel["category"],
}>

export type GetSingleServiceDTO = DTO<IServiceModel, {
    _id: string,
    title: string,
    description: string,
    cover: string,
    priceInputs: IPriceInputs[],
    category: ICategoryModel[],
}>

