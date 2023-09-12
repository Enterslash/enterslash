import { DTO } from ".";
import { IMessageModel, IUserModel, MessageType } from "../models";

export type CreateMessageDTO = DTO<IMessageModel, {
    room?: string,
    sender?: string,
    message: string,
    attachments?: File[],
    type: MessageType,
}>

export type GetLatestMessageDTO = {
    lastMessage?: string
}

export type GetMessageDTO = DTO<IMessageModel, {
    sender?: {
        _id: string,
        firstName?: string,
        lastName?: string,
        avatar?: string,
    },
    message: string,
    attachments?: string[],
    type?: MessageType,
    _id?: string,
}>

export type GetSingleMessageDTO = DTO<IMessageModel, {
    receiver: string,
    sender: string,
    isMe: boolean,
    booking: string,
    message: string,
    attachments: string[],
    type: MessageType,
    _id: string,
}>

export type GetConversationsDTO = DTO<IUserModel, {
    bookingId: string,
    firstName: string,
    lastName: string,
    avatar: string,
    email: string,
    unseenMessages: number,
    service: {
        title: string,
    }
}>