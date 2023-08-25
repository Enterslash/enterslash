import { DTO } from '.';
import { ILogModel } from '../models';

export type GetLogDTO = DTO<ILogModel, {
    _id: string,
    timestamp: Date,
    level: 'info' | 'error' | 'warn',
    message: string,
  }
>;