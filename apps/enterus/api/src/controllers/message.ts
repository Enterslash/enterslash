import { GetConversationsDTO, GetMessageDTO, IAuthRequest, Select } from "@enterslash/enterus/types";
import { success, failed } from "../utils/response";
import Message from "../models/Message";
import { Types } from "mongoose";
import { emitUnseenMessage } from "../listeners";
import { logger } from "../middleware/logger/logger";
import Room from "../models/Room";

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

export const getConversations = async (req: IAuthRequest, res, next) => {
    try {
        const userId = req.user._id;

        const conversations = await Room.aggregate([
            {
                $match: {
                    users: {
                        $elemMatch: {
                            $eq: userId
                        }
                    }
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