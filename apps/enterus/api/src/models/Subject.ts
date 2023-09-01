import { ISubject } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const subjectSchema = new Schema<ISubject>(
    {
        name: {
            type: String,
            required: true,
        },
    }
);

const Subject = model("Subject", subjectSchema);

export default Subject;
