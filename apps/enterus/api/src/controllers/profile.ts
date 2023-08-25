import { EditProfileDTO, IFileRequest, IRequest } from "@enterslash/enterus/types";
import { IAuthRequest } from "@enterslash/enterus/types";
import { uploadImage } from "../utils/file";
import { failed, success } from "../utils/response";
import User from "../models/User";
import { logger } from "../middleware/logger/logger";

export const getMyProfile = async (req: IAuthRequest, res, next) => {
    try {
        const profile = await User.findOne({ _id: req.user._id });
        if (!profile) {
            return res.status(200).json(success({ data: null }));
        }
        return res.status(200).json(success({ data: profile }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const getUserProfile = async (req: IRequest<null, { id: string }>, res, next) => {
    try {
        const { id } = req.params;
        const profile = await User.findOne({ _id: id });
        return res.status(200).json(success({ data: profile }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const editMyProfile = async (req: IFileRequest<EditProfileDTO>, res) => {
    try {
        const newAvatar = req.files?.avatar;
        const { firstName, lastName, phone, location, avatar: oldAvatar } = req.body;
        let avatarUrl;

        if (newAvatar) {
            const cloudImage = await uploadImage(newAvatar);
            avatarUrl = cloudImage?.secure_url;
        } else if (oldAvatar) {
            avatarUrl = oldAvatar;
        } else {
            logger.error("no avatar");
        }

        const profile = await User.findOneAndUpdate({ _id: req.user._id }, {
            firstName,
            lastName,
            phone,
            location,
            avatar: avatarUrl,
        }, { new: true })
        return res.status(200).json(success({ data: profile }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};
