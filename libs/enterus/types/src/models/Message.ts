import { IRoom } from "./Room";
import { IUserModel } from "./User";

export enum MessageType {
    TEXT = "text",
    NOTIFICATION = "notification",
}

export interface IMessage {
    sender: IUserModel,
    room: IRoom,
    message: string,
    attachments: string[],
    type: MessageType,
}

export interface IMessageModel extends IMessage, Document { }