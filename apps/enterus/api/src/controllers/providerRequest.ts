import { IAuthRequest, IFileRequest, ProviderRequestStatus, RequestToBeProviderDTO } from "@enterslash/enterus/types";
import { failed, success } from "../utils/response";
import { uploadImage } from "../utils/file";
import ProviderRequest from "../models/ProviderRequest";
import Document from "../models/Document";
import { logger } from "../middleware/logger/logger";

export const requestToBeProvider = async (req: IFileRequest<RequestToBeProviderDTO>, res, next) => {
    try {
        const { idType } = req.body;
        const { frontImage, backImage } = req.files;

        const front = await uploadImage(frontImage);
        const back = await uploadImage(backImage);

        const existingRequest = await ProviderRequest.findOne({ provider: req.user._id });

        if (!existingRequest) {
            const newDocument = new Document({
                user: req.user._id,
                documentType: idType,
                front: front.secure_url,
                back: back.secure_url,
            })
            const document = await newDocument.save();

            const newRequest = new ProviderRequest({
                provider: req.user._id,
                document: document._id,
                status: ProviderRequestStatus.PENDING
            });

            const request = await newRequest.save();

            return res.status(200).json(success({ data: request }));
        } else {
            return res.status(400).json(failed({ issue: "You already have sent a request!" }));
        }

    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const getMyProviderRequest = async (req: IAuthRequest, res, next) => {
    try {
        const userId = req.user._id;
        const request = await ProviderRequest.findOne({ provider: userId }).populate("document");
        return res.status(200).json(success({ data: request }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};