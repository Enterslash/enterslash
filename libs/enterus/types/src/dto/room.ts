import { DTO } from ".";
import { IParticipantsModel, IRoomModel, IUserModel } from "../models";

interface IdentifierOption {
    label: string,
    value: string,
}

export interface IRoomIdentifiers {
    subject: IdentifierOption[],
    section: IdentifierOption[],
}

export interface JoinRoomDTO {
    batch: string,
    subject: string,
    section: string,
    course: string,
    code: string,
}

export type GetRoomParticipantsDTO = DTO<IUserModel, {
    _id: string,
    firstName: string,
    lastName: string,
    avatar: string,
}>

export type GetRoomsDTO = DTO<IRoomModel, {
    _id: string,
    roomId: string,
    roomType: string,
    // participants: GetRoomParticipantsDTO[]
}>