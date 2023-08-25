import { IAuthRequest } from "@enterslash/enterus/types";
import { success, failed } from "../utils/response";
import Notification from "../models/Notification";
import { emitUnseenNotification } from "../listeners/notification";
import { logger } from "../middleware/logger/logger";

export const getNotifications = async (req: IAuthRequest, res, next) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({
            user: userId,
        });
        const seenMessages = await Notification.updateMany(
            { user: userId, seen: false },
            { $set: { seen: true } },
            { multi: true }
        );
        emitUnseenNotification(userId, -seenMessages.modifiedCount)
        res.status(201).json(success({ data: notifications }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};