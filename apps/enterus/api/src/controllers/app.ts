import { GetAppStateDTO, IAuthRequest, UpdateFcmTokenDTO } from "@enterslash/enterus/types";
import { failed, success } from "../utils/response";
import FCM from "../models/FCM";
import Message from "../models/Message";
import Notification from "../models/Notification";
import { logger } from "../middleware/logger/logger";

export const updateFcmToken = async (req: IAuthRequest<UpdateFcmTokenDTO>, res, next) => {
    try {
        const { fcmToken } = req.body;
        const sessionId = req.session;
        const userId = req.user._id;

        const fcm = await FCM.findOne({ session: sessionId });
        
        if (!fcm) {
            const newFcm = new FCM({
                user: userId,
                session: sessionId,
                token: fcmToken,
            });
            await newFcm.save();
        } else {
            await FCM.findOneAndUpdate(
                { session: sessionId },
                { token: fcmToken }
            );
        }
        return res.status(200).json(success({ message: "FCM token updated" }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
}

export const getAppState = async (req: IAuthRequest, res, next) => {
    try {
        const userId = req.user._id;

        const unseenMessages = await Message.aggregate([
            {
                $match: {
                    receiver: userId,
                    seen: false
                }
            },
            {
                $lookup: {
                    from: "bookings",
                    localField: "booking",
                    foreignField: "_id",
                    as: "booking"
                }
            },
            // {
            //     $match: {
            //         $or: [
            //             { "booking.status": BookingStatus.ACCEPTED },
            //             { "booking.status": BookingStatus.COMPLETED }
            //         ]
            //     }
            // },
            {
                $count: "unseenMessages"
            }
        ]);

        const unseenNotifications = await Notification.count({
            user: userId,
            seen: false
        });

        const data: GetAppStateDTO = {
            unseenMessages: unseenMessages[0]?.unseenMessages || 0,
            unseenNotifications: unseenNotifications || 0,
        }

        return res.status(200).json(success({ data }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
}