import { INotificationModel, NotificationType } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const notificationSchema = new Schema<INotificationModel>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        ref: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        seen: {
            type: Boolean,
            default: false,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        type: {
            type: String,
            enum: NotificationType,
            required: true,
        },
        link: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Notification = model("Notification", notificationSchema);

export default Notification;
