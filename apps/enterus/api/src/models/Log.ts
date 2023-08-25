import { ILogModel, LogType,  } from '@enterslash/enterus/types';
import { Schema, model } from 'mongoose';

const logSchema = new Schema<ILogModel>({
  timestamp: {
    type: Date,
    required: true,
  },
  level: {
    type: String,
    enum: LogType,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Log = model('Log', logSchema);

export default Log;
