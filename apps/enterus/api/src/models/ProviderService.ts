import { IProviderServiceModel, ProviderServiceStatus } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const reviewSchema = new Schema<IProviderServiceModel>(
    {
        provider: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        service: {
            type: Schema.Types.ObjectId,
            ref: "Service",
        },
        location: {
            name: String,
            lat: Number,
            lng: Number,
            range: Number,
        },
        document: {
            type: Schema.Types.ObjectId,
            ref: "Document",
        },
        priceInputs: [{
            name: String,
            value: Number,
            unite: String,
        }],
        status: {
            type: String,
            enum: ProviderServiceStatus,
            default: ProviderServiceStatus.PENDING,
        },
    },
    {
        timestamps: true,
    }
);

const ProviderService = model("ProviderService", reviewSchema);

export default ProviderService;
