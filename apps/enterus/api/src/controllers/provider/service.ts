import { IAuthRequest, ProviderServiceStatus, StartServiceDTO } from "@enterslash/enterus/types";
import { success, failed } from "../../utils/response";
import ProviderService from "../../models/ProviderService";
import { logger } from "../../middleware/logger/logger";

export const startService = async (req: IAuthRequest<StartServiceDTO, { id: string }>, res, next) => {
    try {
        const userId = req.user._id;
        const serviceId = req.params.id;
        const { location, priceInputs } = req.body;
        const existingService = await ProviderService.findOne({
            provider: userId,
            service: serviceId,
        })
        if (existingService) {
            return res.status(400).json(failed({ issue: "You can't request for same service!" }));
        }
        const service = new ProviderService({
            provider: userId,
            service: serviceId,
            location,
            priceInputs,
        })
        await service.save();
        res.status(201).json(success({ message: "Service started!" }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const allMyServiceRequest = async (req: IAuthRequest<null, null>, res, next) => {
    try {
        const userId = req.user._id;
        const services = await ProviderService.find({
            provider: userId,
        }).populate("service")
        res.status(200).json(success({ data: services }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const singleServiceRequest = async (req: IAuthRequest<null, { id: string }>, res, next) => {
    try {
        const requestId = req.params.id;
        const service = await ProviderService.findOne({
            _id: requestId,
        }).populate("service")
        res.status(200).json(success({ data: service }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const changeServiceStatus = async (req: IAuthRequest<null, { id: string, status: ProviderServiceStatus }>, res, next) => {
    try {
        const requestId = req.params.id;
        const status = req.params.status;

        if (![ProviderServiceStatus.ACTIVE, ProviderServiceStatus.DEACTIVATED].includes(status)) {
            return res.status(400).json(failed({ issue: "Invalid status" }));
        }

        await ProviderService.findOneAndUpdate({
            _id: requestId,
        }, {
            status,
        })

        res.status(201).json(success({ message: `Service ${status}!` }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};