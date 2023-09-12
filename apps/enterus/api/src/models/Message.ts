import { IMessage, MessageType } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const messageSchema = new Schema<IMessage>(
    {
        room: {
            type: Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        sender: {
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
    },
    {
        timestamps: true,
    }
);

const Message = model("Message", messageSchema);

export default Message;
