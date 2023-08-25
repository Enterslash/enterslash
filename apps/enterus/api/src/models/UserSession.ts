import { IUserSessionModel } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const userSessionSchema = new Schema<IUserSessionModel>(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		sessionUUID: {
			type: String,
			required: true,
		},
		expireDate: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export const UserSession = model("UserSession", userSessionSchema);

export default UserSession;
