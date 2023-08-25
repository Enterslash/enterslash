import { DocumentType, IDocumentModel } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const documentSchema = new Schema<IDocumentModel>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        documentType: {
            type: String,
            enum: DocumentType,
        },
        front: {
            type: String,
            required: true,
        },
        back: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Document = model("Document", documentSchema);

export default Document;
