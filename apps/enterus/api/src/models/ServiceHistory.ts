import { IServiceHistory } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const serviceHistorySchema = new Schema<IServiceHistory>(
    {
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        date: Date
    },
    {
        timestamps: true,
    }
);

const ServiceHistory = model("ServiceHistory", serviceHistorySchema);

export default ServiceHistory;
