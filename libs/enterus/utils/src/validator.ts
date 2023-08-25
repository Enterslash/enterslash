import { IUser, IUserModel } from "@enterslash/enterus/types";

const requiredInfo: (keyof IUser)[] = [
    'firstName',
    'lastName',
    'location',
    'phone',
];

export const validateUserProfile = (user: IUserModel): boolean => {
    return requiredInfo.every((key) => !!user[key]);
}