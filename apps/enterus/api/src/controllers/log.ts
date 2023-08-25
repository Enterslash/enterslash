import { IRequest } from '@enterslash/enterus/types';
import Log from '../models/Log';
import { failed, success } from '../utils/response';
import { logger } from '../middleware/logger/logger';

export const getAllLog = async (req: IRequest, res, next) => {
  try {
    const limit = 100
    const log = await Log.find({}).sort({ timestamp: -1 }).limit(limit);
    res.status(201).json(success({ data: log }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};
