import { BookingStatus, CreateMessageDTO, GetConversationsDTO, GetLatestMessageDTO, GetMessageDTO, IAuthRequest, IFileRequest, MessageType, Select, UserType } from "@enterslash/enterus/types";
import { success, failed } from "../utils/response";
import { uploadImage } from "../utils/file";
import Message from "../models/Message";
import Booking from "../models/Booking";
import { Types } from "mongoose";
import { checkAccess } from "../utils/helper";
import { pushNotification } from "../utils/push-notification";
import { AppLinks } from "@enterslash/enterus/utils";
import { emitUnseenMessage } from "../listeners";
import { logger } from "../middleware/logger/logger";

export const createMessage = async (req: IFileRequest<CreateMessageDTO>, res, next) => {
    try {
        const attachments = req.files?.attachments;
        const { booking, message, type } = req.body;
        const { _id: userId } = req.user;

        const bookingData = await Booking.findById(booking);

        let receiverId;

        if (bookingData.user.toString() === userId.toString()) {
            receiverId = bookingData.provider;
        } else {
            receiverId = bookingData.user;
        }

        const imageUrls = [];

        try {
            if (attachments) {
                if (Array.isArray(attachments)) {
                    await Promise.all(attachments.map(async (image) => {
                        const { secure_url } = await uploadImage(image)
                        imageUrls.push(secure_url);
                    }))
                } else {
                    const { secure_url } = await uploadImage(attachments)
                    imageUrls.push(secure_url);
                }
            }
        } catch (error) {
            return res.status(500).json(failed({ issue: error.message }));
        }

        const newMessage = await Message.create({
            booking,
            message,
            receiver: receiverId,
            sender: userId,
            type,
            attachments: imageUrls,
        });

        pushNotification({
            title: "New Message",
            body: message,
            link: AppLinks.message(booking),
            userId: receiverId,
        })

        res.status(201).json(success({ data: newMessage }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const getMessages = async (req: IAuthRequest<null, { bookingId: string }>, res, next) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user._id;

        const messages = await Message.aggregate([
            {
                $match: {
                    booking: new Types.ObjectId(bookingId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sender",
                    foreignField: "_id",
                    as: "sender",
                }
            },
            {
                $unwind: "$sender",
            },
            {
                $lookup: {
                    from: "users",
                    localField: "receiver",
                    foreignField: "_id",
                    as: "receiver",
                }
            },
            {
                $unwind: "$receiver",
            },
            {
                $project: {
                    _id: 1,
                    receiver: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                    sender: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                    isMe: {
                        $eq: ["$sender._id", userId]
                    },
                    seen: 1,
                    booking: 1,
                    message: 1,
                    attachments: 1,
                    type: 1,
                } as Select<GetMessageDTO>
            }
        ]);

        const updated = await Message.updateMany({
            booking: bookingId,
            receiver: userId,
            seen: false,
        }, {
            seen: true,
        });

        emitUnseenMessage(userId, {
            booking: bookingId,
            count: -updated.modifiedCount
        })

        res.status(201).json(success({ data: messages }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const getLatestMessages = async (req: IAuthRequest<GetLatestMessageDTO, { bookingId: string }>, res, next) => {
    try {
        const { bookingId } = req.params;
        const { lastMessage } = req.body;
        const userId = req.user._id;

        const messages = await Message.aggregate([
            {
                $match: {
                    booking: new Types.ObjectId(bookingId),
                    ...(lastMessage ? { _id: { $gt: new Types.ObjectId(lastMessage) } } : {})
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sender",
                    foreignField: "_id",
                    as: "sender",
                }
            },
            {
                $unwind: "$sender",
            },
            {
                $lookup: {
                    from: "users",
                    localField: "receiver",
                    foreignField: "_id",
                    as: "receiver",
                }
            },
            {
                $unwind: "$receiver",
            },
            {
                $project: {
                    _id: 1,
                    receiver: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                    sender: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                    isMe: {
                        $eq: ["$sender._id", userId]
                    },
                    seen: 1,
                    booking: 1,
                    message: 1,
                    attachments: 1,
                    type: 1,
                } as Select<GetMessageDTO>
            }
        ]);

        res.status(201).json(success({ data: messages }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const getConversations = async (req: IAuthRequest, res, next) => {
    try {
        const userId = req.user._id;
        const userType = req.user.userType;

        const isSuperAdmin = checkAccess(userType, [UserType.SUPER_ADMIN])

        const isProvider = checkAccess(userType, [UserType.PROVIDER, UserType.SUPER_ADMIN, UserType.ADMIN])

        const conversations = await Booking.aggregate([
            {
                $match: {
                    $and: [
                        (isSuperAdmin ? {} : {
                            $or: [
                                { user: userId },
                                { provider: userId },
                            ],
                        }),
                        { status: BookingStatus.ACCEPTED }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: !isProvider ? "provider" : "user",
                    foreignField: "_id",
                    as: "user",
                }
            },
            {
                $unwind: "$user",
            },
            {
                $lookup: {
                    from: "services",
                    localField: "service",
                    foreignField: "_id",
                    as: "service",
                }
            },
            {
                $unwind: "$service",
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "_id",
                    foreignField: "booking",
                    as: "messages",
                }
            },
            {
                $addFields: {
                    unseenMessages: {
                        $size: {
                            $ifNull: [{
                                $filter: {
                                    input: "$messages",
                                    as: "message",
                                    cond: {
                                        $and: [
                                            { $eq: ["$$message.seen", false] },
                                            { $eq: ["$$message.receiver", new Types.ObjectId(userId)] },
                                        ]
                                    }
                                }
                            }, []],
                        }
                    }
                }
            },
            {
                $project: {
                    bookingId: "$_id",
                    firstName: "$user.firstName",
                    lastName: "$user.lastName",
                    avatar: "$user.avatar",
                    email: "$user.email",
                    unseenMessages: 1,
                    service: {
                        title: 1,
                    }
                } as Select<GetConversationsDTO>
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]);

        res.status(201).json(success({ data: conversations }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};