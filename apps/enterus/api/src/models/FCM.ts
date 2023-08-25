import { IFCM } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const fcmSchema = new Schema<IFCM>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        session: {
            type: Schema.Types.ObjectId,
            ref: "UserSession",
        },
        token: String,
    }
);

const FCM = model("FCM", fcmSchema);

export default FCM;
