import { DTO } from ".";
import { IUserModel } from "../models";

export type EditProfileDTO = DTO<IUserModel, {
    firstName: string,
    lastName: string,
    avatar?: File,
    phone: string,
    location: string,
}>