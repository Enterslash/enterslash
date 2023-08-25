import { Document } from 'mongoose';

export enum UserType {
    PROVIDER = 'PROVIDER',
    CONSUMER = 'CONSUMER',
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    BLOG_MANAGER= "BLOG_MANAGER"
}

export interface IUser {
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    avatar: string,
    phone: string,
    location: string,
    userType: UserType[],
}

export interface IUserModel extends IUser, Document { }