import cloudinarySDK from "cloudinary";
import { logger } from "../middleware/logger/logger";

const cloudinary = cloudinarySDK.v2

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

const configure = () => {
	try {
		cloudinary.config({
			cloud_name: CLOUDINARY_NAME,
			api_key: CLOUDINARY_API_KEY,
			api_secret: CLOUDINARY_API_SECRET,
		});

		logger.info("Configured successful.");
	} catch (error) {
		logger.error("Configured failed!");
		console.error(error);
		process.exit(1);
	}
};

module.exports = configure;
