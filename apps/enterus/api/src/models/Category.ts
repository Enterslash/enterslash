import { ICategoryModel } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const categorySchema = new Schema<ICategoryModel>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

const Category = model("Category", categorySchema);

export default Category;
