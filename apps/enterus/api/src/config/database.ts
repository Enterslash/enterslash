import mongoose from "mongoose";
import { logger } from "../middleware/logger/logger";

const { MONGODB_URI } = process.env;

export const connectDatabase = () => {
  mongoose
    .connect(MONGODB_URI, {
      autoIndex: false,
    })
    .then(() => logger.info("Database Connected"))
    .catch((err) => logger.error(err));
};

