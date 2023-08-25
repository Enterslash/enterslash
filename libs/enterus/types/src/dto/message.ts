import { DTO } from ".";
import { IBookingModel, IMessageModel, IUserModel, MessageType } from "../models";

export type CreateMessageDTO = DTO<IMessageModel, {
    room?: string,
    receiver?: string,
    sender?: string,
    booking: string,
    message: string,
    attachments?: File[],
    type: MessageType,
}>

export type GetLatestMessageDTO = {
    lastMessage?: string
}

export type GetMessageDTO = DTO<IMessageModel, {
    receiver?: {
        _id: string,
        firstName: string,
        lastName: string,
        avatar: string,
    },
    sender?: {
        _id: string,
        firstName: string,
        lastName: string,
        avatar: string,
    },
    isMe: boolean,
    booking?: string,
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
    // lastMessage: {
    //     message: string,
    //     type: MessageType,
    //     createdAt: Date,
    // },
    // unReadMessages: number,
    // active: boolean,
}>