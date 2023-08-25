import { IMessage, MessageType } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const messageSchema = new Schema<IMessage>(
    {
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
        },
        attachments: {
            type: [String],
            default: [],
        },
        type: {
            type: String,
            enum: MessageType,
            default: MessageType.TEXT,
        },
        seen: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const Message = model("Message", messageSchema);

export default Message;
