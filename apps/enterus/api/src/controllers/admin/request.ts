import { GetProviderServiceDTO, HandleServiceRequestDTO, IAuthRequest, ProviderServiceStatus, Select } from "@enterslash/enterus/types";
import { success, failed } from "../../utils/response";
import ProviderService from "../../models/ProviderService";
import { logger } from "../../middleware/logger/logger";

export const getServiceRequests = async (req: IAuthRequest<HandleServiceRequestDTO>, res, next) => {
    try {
        const selectProviderServiceDTO: Select<GetProviderServiceDTO> = {
            service: {
                _id: 1,
                title: 1,
            },
            provider: {
                _id: 1,
                username: 1,
            },
            location: {
                name: 1,
                range: 1,
            },
            priceInputs: 1,
            status: 1,
        }

        const requests = await ProviderService.aggregate([
            {
                $lookup: {
                    from: "services",
                    localField: "service",
                    foreignField: "_id",
                    as: "service",
                },
            },
            {
                $unwind: "$service",
            },
            {
                $lookup: {
                    from: "users",
                    localField: "provider",
                    foreignField: "_id",
                    as: "provider",
                },
            },
            {
                $unwind: "$provider",
            },
            {
                $project: selectProviderServiceDTO,
            }
        ])
        res.status(201).json(success({ data: requests }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const handleServiceRequest = async (req: IAuthRequest<HandleServiceRequestDTO>, res, next) => {
    try {
        const { providerId, serviceId, status } = req.body

        if (![ProviderServiceStatus.ACTIVE, ProviderServiceStatus.REJECTED].includes(status)) {
            return res.status(400).json(failed({ issue: "Invalid status" }));
        }

        await ProviderService.findOneAndUpdate({
            provider: providerId,
            service: serviceId,
        }, {
            status,
        })
        res.status(201).json(success({ message: `Service ${status}!` }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};