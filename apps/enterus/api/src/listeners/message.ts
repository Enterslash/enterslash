import { CreateMessageDTO, IUserModel, MessageType, NotificationType } from "@enterslash/enterus/types";
import Message from "../models/Message";
import { uploadImage } from "../utils/file";
import { failed, success } from "../utils/response";
import { pushNotification } from "../utils/push-notification";
import { AppLinks } from "@enterslash/enterus/utils";
import { ioRef } from "../config/socket";
import { emitUnseenNotification } from "./notification";
import { createNotification } from "../utils/create-notification";
import { logger } from "../middleware/logger/logger";
import Participant from "../models/Participant";

interface IRoom {
    roomId: string,
    users: {
        id: string,
        isTyping: boolean
    }[]
}

const rooms: IRoom[] = []

const addUser = (roomId, userId) => {
    const roomIdx = rooms.findIndex(room => room.roomId === roomId);
    if (roomIdx === -1) {
        rooms.push({
            roomId,
            users: [{
                id: userId,
                isTyping: false
            }]
        })
    } else {
        const user = rooms[roomIdx].users.some(user => user.id === userId)
        if (!user) {
            rooms[roomIdx].users.push({
                id: userId,
                isTyping: false
            });
        }
    }
}

const removeUser = (roomId, userId) => {
    const roomIdx = rooms.findIndex(room => room.roomId === roomId);
    if (roomIdx !== -1) {
        const userIdx = rooms[roomIdx].users.findIndex(user => user.id === userId);
        if (userIdx !== -1) {
            rooms[roomIdx].users.splice(userIdx, 1);
        }
    }
}

const isOnline = (roomId, userId) => {
    const roomIdx = rooms.findIndex(room => room.roomId === roomId);
    if (roomIdx !== -1) {
        const userIdx = rooms[roomIdx].users.findIndex(user => user.id === userId);
        if (userIdx !== -1) {
            return true;
        }
    }
    return false;
}

const offlineUsers = async (roomId: string) => {
    const participants = await Participant.find({
        room: roomId,
    });
    const room = rooms.find(room => room.roomId === roomId);
    if (room) {
        return participants.filter(p => {
            return !room.users.some(u => {
                return u.id === p.user.toString()
            })
        }).map(p => p.user.toString())
    }
}

export const messageListener = (io, socket) => {
    const joinRoom = (payload) => {
        const { room, user } = payload;
        socket.join(room);
        addUser(room, user)
    }

    const send = async (payload: CreateMessageDTO) => {
        const { room, attachments, message, sender, type } = payload;
        try {
            const imageUrls = [];

            try {
                if (attachments) {
                    if (Array.isArray(attachments)) {
                        await Promise.all(attachments.map(async (image) => {
                            const { secure_url } = await uploadImage({
                                tempFilePath: image
                            })
                            imageUrls.push(secure_url);
                        }))
                    } else {
                        const { secure_url } = await uploadImage({
                            tempFilePath: attachments
                        })
                        imageUrls.push(secure_url);
                    }
                }
            } catch (error) {
                logger.error(error);
                socket.to(room).emit("message:error", failed({ issue: error.message }));
            }

            const newMessage = await Message.create({
                room,
                message,
                sender,
                type,
                attachments: imageUrls,
            });

            const offlineUserList = await offlineUsers(room);

            if (offlineUserList.length) {
                // emitUnseenMessage(receiver, {
                //     booking,
                //     count: 1
                // })
                pushNotification({
                    title: "New Message",
                    body: message,
                    link: AppLinks.message(room),
                    users: offlineUserList,
                })
            }

            socket.to(room).emit("message:get", success({ data: newMessage }));
        } catch (error) {
            logger.error(error);
            socket.to(room).emit("message:error", failed({ issue: error.message }));
        }
    }

    const leaveRoom = (payload) => {
        const { room, user } = payload;
        socket.leave(room);
        removeUser(room, user);
    }

    socket.on("message:join", joinRoom);
    socket.on("message:leave", leaveRoom);
    socket.on("message:send", send);
}

// send unseen message from outside socket
export const emitUnseenMessage = (receiver: string, {
    booking,
    count,
}) => {
    ioRef.to(receiver.toString()).emit('message:unseen', {
        bookingId: booking.toString(),
        count,
    })
}

// send message from outside socket
export const emitNotificationMessage = (bookingId: string, newMessage: {
    title: string,
    link: string,
    type: NotificationType,
    ref: string,
    booking: any,
    message: string,
    receiver: any,
    sender: any,
}) => {
    const booking = bookingId.toString();
    const receiver = newMessage.receiver.toString()
    const message = { ...newMessage, type: MessageType.NOTIFICATION }
    new Message(message).save();
    ioRef.to(receiver).emit("message:get", success({ data: message }));
    if (!isOnline(booking, receiver)) {
        emitUnseenMessage(receiver, {
            booking,
            count: 1
        })
        emitUnseenNotification(receiver, 1);
        createNotification({
            title: newMessage.title,
            body: newMessage.message,
            userId: receiver,
            link: newMessage.link,
            type: newMessage.type,
            ref: newMessage.ref,
        })
    }
}