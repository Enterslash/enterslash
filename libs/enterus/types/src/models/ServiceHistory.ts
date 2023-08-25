import { Document } from 'mongoose';
import { IBookingModel } from './Booking';

export interface IServiceHistory {
    booking: IBookingModel,
    date: Date,
}

export interface IServiceHistoryModel extends IServiceHistory, Document { }