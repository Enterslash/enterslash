import { Document } from 'mongoose';
import { IUserModel } from './User';
import { IUserSessionModel } from './Session';

export interface IFCM {
    user: IUserModel,
    session: IUserSessionModel,
    token: string,
}

export interface IFCMModel extends IFCM, Document { }