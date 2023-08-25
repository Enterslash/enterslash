import { $socket } from "./client";

export const subscribe_socket = (userId: string) => {
    return $socket.emit('socket:subscribe', {
        user: userId
    });
}