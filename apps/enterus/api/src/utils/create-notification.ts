import {
    IUserModel,
    NotificationType
} from "@enterslash/enterus/types";
import Notification from "../models/Notification";
import { pushNotification } from "./push-notification";
import { logger } from "../middleware/logger/logger";

interface CreateNotification {
    title: string;
    body: string;
    userId?: string[];
    link?: string;
    ref?: any;
    type: NotificationType
}

export const createNotification = async (data: CreateNotification) => {
    try {
        await Notification.create({
            user: data.userId,
            ref: data.ref,
            title: data.title,
            message: data.body,
            seen: false,
            date: new Date(),
            type: data.type,
            link: data.link,
        })
    } catch (error) {
        logger.error(error);
    }
    try {
        await pushNotification({
            title: data.title,
            body: data.body,
            users: data.userId,
            link: data.link,
        })
    } catch (error) {
        logger.error(error);
    }
}