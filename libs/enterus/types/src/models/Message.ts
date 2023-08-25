import { IBookingModel } from "./Booking";
import { IUserModel } from "./User";

export enum MessageType {
    TEXT = "text",
    IMAGE = "image",
    NOTIFICATION = "notification",
}

export interface IMessage {
    receiver: IUserModel,
    sender: IUserModel,
    booking: IBookingModel,
    message: string,
    attachments: string[],
    type: MessageType,
    seen: boolean,
}

export interface IMessageModel extends IMessage, Document { }