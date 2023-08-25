import cloudinarySDK, { UploadApiResponse } from 'cloudinary';
const cloudinary = cloudinarySDK.v2;

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
	cloud_name: CLOUDINARY_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET
});

export const uploadImage = async (file): Promise<UploadApiResponse> => {
	try {
		return cloudinary.uploader.upload(file.tempFilePath);
	} catch (error) {
		console.error(error);
	}
};