import { IRoom, RoomType } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const roomSchema = new Schema<IRoom>(
    {
        roomId: {
            type: String,
            required: true,
            unique: true,
        },
        roomType: {
            type: String,
            enum: RoomType,
            required: true,
        },
        title: {
            type: String,
        },
        cover: {
            type: String,
        }
    }
);

const Room = model("Room", roomSchema);

export default Room;
