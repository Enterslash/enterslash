import { ObjectId } from 'mongoose';

export enum LogType {
    INFO = 'info',
    ERROR = 'error',
    WARN = 'warn',
}

export interface ILog {
    _id: ObjectId,
    timestamp: Date,
    level: 'info' | 'error' | 'warn',
    message: string,
}
export interface ILogModel extends ILog, Document { }

