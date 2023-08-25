import { logger } from "../../middleware/logger/logger";
import Booking from "../../models/Booking";
import User from "../../models/User";
import { success, failed } from "../../utils/response";
import { AssignServiceDTO, IAuthRequest, UserType } from "@enterslash/enterus/types";

export const getAllProviders = async (req: IAuthRequest, res, next) => {
    try {
        const providers = await User.find({
            _id: {
                $ne: req.user._id
            },
            userType: {
                $in: [UserType.PROVIDER]
            }
        });
        res.status(201).json(success({ data: providers }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const assignService = async (req: IAuthRequest<AssignServiceDTO>, res, next) => {
    try {
        const { providerId, bookingId } = req.body;

        await Booking.findOneAndUpdate({ _id: bookingId }, { provider: providerId }, { new: true });

        res.status(201).json(success({ message: "Booking assigned!" }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};