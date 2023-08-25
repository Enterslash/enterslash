import { CreateMessageDTO, IMessageModel } from "@enterslash/enterus/types";
import { $socket } from "./client";

export const listen_message = (cb: (data: IMessageModel) => void) => {
    return $socket.on('message:get', (data) => {
        cb(data);
    });
}

export const listen_unseen_message = (cb: (data: { count: number, bookingId: string }) => void) => {
    $socket.off('message:unseen')
    $socket.on('message:unseen', (data) => {
        cb(data);
    });
}

export const listen_message_error = (cb: (data: IMessageModel) => void) => {
    return $socket.on('message:error', (data) => {
        cb(data.error);
    });
}

export const join_room = (roomId: string, userId: string) => {
    $socket.emit('message:join', {
        room: roomId,
        user: userId
    });
}

export const leave_room = (roomId: string, userId: string) => {
    $socket.emit('message:leave', {
        room: roomId,
        user: userId
    });
    $socket.off('message:get');
}

export const send_message = (data: CreateMessageDTO & { room: string }) => {
    $socket.emit('message:send', data);
}