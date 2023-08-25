import { Document } from 'mongoose';
import { IUserModel } from './User';
import { IDocumentModel } from './Document';

export enum ProviderRequestStatus {
    PENDING = "PENDING",
    REJECTED = "REJECTED",
    ACCEPTED = "ACCEPTED",
}

export interface IProviderRequest {
    provider: IUserModel,
    document: IDocumentModel,
    status: ProviderRequestStatus,
}

export interface IProviderRequestModel extends IProviderRequest, Document { }