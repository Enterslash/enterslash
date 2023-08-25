import { Document } from 'mongoose';
import { IUserModel } from './User';

export enum DocumentType {
    NATIONAL_ID = 'NATIONAL_ID',
    PASSPORT = 'PASSPORT',
    DRIVER_LICENSE = 'DRIVER_LICENSE',
}

export interface IDocument {
    user: IUserModel,
    documentType: DocumentType,
    front: string,
    back: string,
    isVerified: boolean,
}

export interface IDocumentModel extends IDocument, Document { }