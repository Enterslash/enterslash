import { IUserModel, UserType } from "@enterslash/enterus/types";

export const isProvider = (userType: IUserModel["userType"]) => {
    return userType?.includes(UserType.PROVIDER);
}