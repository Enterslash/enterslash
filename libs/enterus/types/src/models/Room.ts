import { Document } from 'mongoose';
import { IUserModel } from './User';

export enum RoomType {
    PRIVATE = "private",
    GROUP = "group",
}

export interface IRoom {
    roomId: string,
    roomType: string,
    title: string,
    cover: string,
    users: IUserModel[],
}

export interface IRoomModel extends IRoom, Document { }