import { DeleteAccountDTO, IAuthRequest } from "@enterslash/enterus/types";
import bcrypt from "bcryptjs";
import { success, failed } from "../utils/response";
import User from "../models/User";
import { logger } from "../middleware/logger/logger";

export const deleteAccount = async (req: IAuthRequest<DeleteAccountDTO>, res, next) => {
    try {
        const userId = req.user._id;
        const { password } = req.body;

        const existingUser = await User.findOne({ _id: userId }).select("+password");

        if (!existingUser) {
            return res.status(404).json(failed({ issue: "User not found" }));
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json(failed({ issue: "Invalid password" }));
        }

        await User.deleteOne({ _id: userId });

        res.status(201).json(success({ message: 'account deleted' }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};