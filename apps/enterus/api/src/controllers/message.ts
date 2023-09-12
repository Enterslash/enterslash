import { GetMessageDTO, IAuthRequest, Select } from "@enterslash/enterus/types";
import { success, failed } from "../utils/response";
import Message from "../models/Message";
import { Types } from "mongoose";
import { emitUnseenMessage } from "../listeners";
import { logger } from "../middleware/logger/logger";

export const getMessages = async (req: IAuthRequest<null, { roomId: string }>, res, next) => {
    try {
        const { roomId } = req.params;
        const userId = req.user._id;

        const messages = await Message.aggregate([
            {
                $match: {
                    room: new Types.ObjectId(roomId)
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
                $project: {
                    _id: 1,
                    sender: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                    },
                    message: 1,
                    attachments: 1,
                    type: 1,
                } as Select<GetMessageDTO>
            }
        ]);

        // const updated = await Message.updateMany({
        //     booking: roomId,
        //     receiver: userId,
        //     seen: false,
        // }, {
        //     seen: true,
        // });

        // emitUnseenMessage(userId, {
        //     booking: roomId,
        //     count: -updated.modifiedCount
        // })

        res.status(201).json(success({ data: messages }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};