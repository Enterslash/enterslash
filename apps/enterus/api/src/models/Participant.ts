import { IParticipants } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const participantSchema = new Schema<IParticipants>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        room: {
            type: Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Participant = model("Participant", participantSchema);

export default Participant;
