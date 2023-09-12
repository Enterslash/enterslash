import { Document } from 'mongoose';
import { IUserModel } from './User';
import { IRoomModel } from './Room';

export interface IParticipants {
    user: IUserModel,
    room: IRoomModel,
}

export interface IParticipantsModel extends IParticipants, Document { }