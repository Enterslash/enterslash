import { IReviewModel } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const reviewSchema = new Schema<IReviewModel>(
    {
        reviewer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        review: {
            type: String,
            required: true,
        },
        service: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Review = model("Review", reviewSchema);

export default Review;
