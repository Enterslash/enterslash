import { HandleProviderRequestDTO, IAuthRequest, NotificationType, ProviderRequestStatus, UserType } from "@enterslash/enterus/types";
import { failed, success } from "../../utils/response";
import ProviderRequest from "../../models/ProviderRequest";
import { AppLinks } from "@enterslash/enterus/utils";
import User from "../../models/User";
import { createNotification } from "../../utils/create-notification";
import { logger } from "../../middleware/logger/logger";

export const getAllProviderRequest = async (req: IAuthRequest, res, next) => {
    try {
        const requests = await ProviderRequest.find({}).populate("provider document");
        return res.status(200).json(success({ data: requests }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const handleProviderRequest = async (req: IAuthRequest<HandleProviderRequestDTO, { id: string }>, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const request = await ProviderRequest.findById(id);
        if (![ProviderRequestStatus.ACCEPTED, ProviderRequestStatus.REJECTED].includes(status)) {
            return res.status(400).json(failed({ issue: "Invalid status" }));
        }
        if (!request) {
            return res.status(404).json(failed({ issue: "Request not found" }));
        } else {
            await ProviderRequest.findOneAndUpdate({ _id: id }, { status });
            let title = "Enterus"
            let message = "You have an update on your request to be a provider!";
            if (status === ProviderRequestStatus.ACCEPTED) {
                await User.findOneAndUpdate(
                    { _id: request.provider },
                    { $push: { userType: UserType.PROVIDER } },
                )
                title = "Congratulation!"
                message = "Your request to be a provider has been accepted!"
            } else if (status === ProviderRequestStatus.REJECTED) {
                await User.findOneAndUpdate(
                    { _id: request.provider },
                    { $pull: { userType: UserType.PROVIDER } }
                )
                title = "Sorry!"
                message = "Your request to be a provider has been rejected!"
            }
            createNotification({
                title,
                body: message,
                userId: request.provider,
                link: AppLinks.settings(),
                type: NotificationType.PROVIDER_REQUEST,
                ref: request._id
            })
            return res.status(200).json(success({ data: request }));
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
}