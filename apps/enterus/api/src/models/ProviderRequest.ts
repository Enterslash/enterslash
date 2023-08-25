import { IProviderRequestModel, ProviderRequestStatus } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const providerRequest = new Schema<IProviderRequestModel>(
    {
        provider: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        document: {
            type: Schema.Types.ObjectId,
            ref: "Document",
        },
        status: {
            type: String,
            enum: ProviderRequestStatus,
            default: ProviderRequestStatus.PENDING,
        },
    },
    {
        timestamps: true,
    }
);

const ProviderRequest = model("ProviderRequest", providerRequest);

export default ProviderRequest;
