import { GetRoomsDTO, IRoomIdentifiers, IRoomModel, JoinRoomDTO } from "@enterslash/enterus/types";
import $api from "./client";

export const get_room_identifiers = (): Promise<IRoomIdentifiers> => {
    return $api.get('/room/identifiers');
}

export const join_room = (data: JoinRoomDTO): Promise<IRoomModel> => {
    return $api.post('/room/join', data);
}

export const get_conversations = (): Promise<GetRoomsDTO[]> => {
    return $api.get('/rooms');
}

export const get_room_info = (roomId: string): Promise<IRoomModel> => {
    return $api.get('/room/'+roomId);
}