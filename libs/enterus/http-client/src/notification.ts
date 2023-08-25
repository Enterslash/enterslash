import { INotificationModel } from "@enterslash/enterus/types";
import $api from "./client";

export const get_notification = (): Promise<INotificationModel[]> => {
    return $api.get('/notifications');
}