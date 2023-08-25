import { Document } from 'mongoose';
import { IUserModel } from './User';
import { IServiceModel } from './Service';

export enum BookingStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    PAUSED = 'PAUSED',
}

export enum BookingPriceStatus {
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
}

export enum BookingType {
    ONE_TIME = 'ONE_TIME',
    WEEKLY = 'WEEKLY',
    BI_WEEKLY = 'BI_WEEKLY',
    MONTHLY = 'MONTHLY',
}

export interface IBooking {
    user: IUserModel,
    service: IServiceModel,
    provider: IUserModel,
    payId: string,
    images: string[],
    date: {
        mode: BookingType,
        start: Date,
        end: Date,
    },
    location: {
        name: string,
        lat: number,
        lng: number,
    },
    status: BookingStatus,
    priceInputs: {
        name: string
        value: string
    }[]
    price: {
        amount: number,
        acceptedByUser: boolean,
        acceptedByProvider: boolean,
    },
}

export interface IBookingModel extends IBooking, Document { }