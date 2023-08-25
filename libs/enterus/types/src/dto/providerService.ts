import { DTO } from ".";
import { IProviderServiceModel, ProviderServiceStatus } from "../models";

export type StartServiceDTO = DTO<IProviderServiceModel, {
    location: IProviderServiceModel['location'],
    priceInputs?: IProviderServiceModel['priceInputs'],
}>

export type GetProviderServiceDTO = DTO<IProviderServiceModel, {
    service: {
        _id: string;
        title: string;
    },
    provider: {
        _id: string;
        username: string;
    },
    location: {
        name: string;
        range: number;
    },
    priceInputs: IProviderServiceModel['priceInputs'],
    status: ProviderServiceStatus;
}>