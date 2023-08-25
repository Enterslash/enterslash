import { ioRef } from "../config/socket";

export const notificationListener = (io, socket) => {
    // ...
}

export const emitUnseenNotification = (receiver: string, count: number) => {
    ioRef.to(receiver.toString()).emit('notification:unseen', {
        count
    })
}