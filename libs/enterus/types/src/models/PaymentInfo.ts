import { Document } from 'mongoose';
import { IUserModel } from './User';

export interface IPaymentInfo {
    user: IUserModel,
    stripeCustomerId: string,
    // cardNumber: string,
    // cardHolder: string,
    // expirationDate: string,
    // cvv: string,
    // isVerified: boolean,
}

export interface IPaymentInfoModel extends IPaymentInfo, Document { }