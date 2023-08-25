import { IUserModel, UserType } from "@enterslash/enterus/types";
import { Schema, model } from "mongoose";

const userSchema = new Schema<IUserModel>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userType: {
      type: [String],
      enum: UserType,
      default: [UserType.CONSUMER],
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
