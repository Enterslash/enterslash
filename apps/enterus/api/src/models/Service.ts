import { IServiceModel, ServiceStatus } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const serviceSchema = new Schema<IServiceModel>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        cover: {
            type: String,
            required: true,
        },
        category: {
            type: [Schema.Types.ObjectId],
            ref: 'Category'
        },
        priceInputs: {
            type: [{
                name: String,
                label: String,
                unite: String,
                defaultValue: Number,
            }],
        },
        status: {
            type: String,
            enum: ServiceStatus,
            default: ServiceStatus.ACTIVE,
        }
    },
    {
        timestamps: true,
    }
);

const Service = model("Service", serviceSchema);

export default Service;
