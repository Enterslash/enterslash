import { DTO } from ".";
import { IUser, IUserModel } from "../models/User";

export type LoginDTO = DTO<IUser, {
    email: string,
    password: string,
}>

export type RegisterDTO = DTO<IUser, {
    username: string,
    email: string,
    password: string,
}>

export type AuthSuccessDTO = {
    jwtToken: string
    user: IUserModel
}