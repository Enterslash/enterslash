import { Document } from 'mongoose';
import { IUserModel } from './User';

export enum NotificationType {
    PROVIDER_REQUEST = 'PROVIDER_REQUEST',
    BOOKING = 'BOOKING',
}

export interface INotification {
    user: IUserModel,
    ref: string,
    title: string,
    message: string,
    seen: boolean,
    date: Date,
    type: NotificationType,
    link: string
}

export interface INotificationModel extends INotification, Document { }