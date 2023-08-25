import { $socket } from "./client";

export const listen_unseen_notification = (cb: (data: { count: number }) => void) => {
    $socket.off('notification:unseen')
    $socket.on('notification:unseen', (data) => {
        cb(data);
    });
}