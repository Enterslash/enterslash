import { Document } from 'mongoose';
import { IUser } from './User';

export interface IUserSession {
    user: IUser,
    sessionUUID: string,
    expireDate: Date,
}

export interface IUserSessionModel extends IUserSession, Document {}