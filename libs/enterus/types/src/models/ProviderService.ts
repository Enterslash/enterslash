import { Document } from 'mongoose';
import { IUserModel } from './User';
import { IServiceModel } from './Service';
import { IDocumentModel } from './Document';

export enum ProviderServiceStatus {
    PENDING = "PENDING",
    REJECTED = "REJECTED",
    ACTIVE = "ACTIVE",
    DEACTIVATED = "DEACTIVATED",
}

export interface IProviderService {
    provider: IUserModel,
    service: IServiceModel,
    document: IDocumentModel,
    location: {
        name: string,
        lat: number,
        lng: number,
        range: number,
    },
    priceInputs: {
        name: string,
        value: number,
        unite: string,
    }[],
    status: ProviderServiceStatus,
}

export interface IProviderServiceModel extends IProviderService, Document { }