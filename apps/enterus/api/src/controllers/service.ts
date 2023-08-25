import { IRequest, Select, GetMultiServicesDTO, GetSingleServiceDTO, ProviderServiceStatus, ServiceStatus } from "@enterslash/enterus/types";
import Service from "../models/Service";
import { Types } from "mongoose";
import { failed, success } from "../utils/response";
import ProviderService from "../models/ProviderService";
import { logger } from "../middleware/logger/logger";

export const getAllService = async (req: IRequest, res, next) => {
    try {
        const { limit, skip } = req.query

        const SelectServicesDTO: Select<GetMultiServicesDTO> = {
            _id: 1,
            cover: 1,
            description: 1,
            title: 1,
            category: 1,
            status: 1,
        }

        const services = await Service.aggregate([
            {
                $match: {
                    status: ServiceStatus.ACTIVE
                }
            },
            {
                $project: SelectServicesDTO,
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                },
            },
            {
                $sort: {
                    _id: -1
                },
            },
            {
                $skip: skip || 0,
            },
            {
                $limit: limit || 10,
            },
        ])
        res.status(201).json(success({ data: services }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const getSingleService = async (req: IRequest<null, { id: string }>, res, next) => {
    try {
        const { id } = req.params;

        const SelectServicesDTO: Select<GetSingleServiceDTO> = {
            _id: 1,
            cover: 1,
            description: 1,
            title: 1,
            priceInputs: 1,
            category: 1,
        }

        const services = await Service.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                },
            },
            {
                $project: SelectServicesDTO,
            }
        ])

        if (services?.[0]) {
            res.status(201).json(success({ data: services[0] }));
        } else {
            return res.status(404).json(failed({ issue: "Service not found" }));
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const getServiceProviders = async (req: IRequest<null, { id: string }>, res, next) => {
    try {
        const { id } = req.params;

        const providers = await ProviderService.aggregate([
            {
                $match: {
                    service: new Types.ObjectId(id),
                    status: ProviderServiceStatus.ACTIVE
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "provider",
                    foreignField: "_id",
                    as: "provider"
                },
            },
            { $unwind: "$provider" },
            {
                $project: {
                    _id: "$provider._id",
                    firstName: "$provider.firstName",
                    lastName: "$provider.lastName",
                    avatar: "$provider.avatar",
                }
            }
        ])

        res.status(201).json(success({ data: providers }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};