import { ChangeServiceStatusDTO, CreateServiceDTO, GetMultiServicesDTO, IAuthRequest, IFileRequest, Select, ServiceStatus } from "@enterslash/enterus/types";
import Service from "../../models/Service";
import { success, failed } from "../../utils/response";
import { uploadImage } from "../../utils/file";
import { logger } from "../../middleware/logger/logger";

export const getAllService = async (req: IAuthRequest, res, next) => {
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

export const createService = async (req: IFileRequest<CreateServiceDTO>, res, next) => {
    try {
        const cover = req.files?.cover;
        const { title, description, category, priceInputs } = req.body;

        let coverUrl;

        if (cover) {
            const cloudImage = await uploadImage(cover);
            coverUrl = cloudImage?.secure_url;
        } else {
            logger.error("no avatar");
        }

        const service = await Service.create({
            title,
            description,
            cover: coverUrl,
            category: JSON.parse(category),
            priceInputs: JSON.parse(priceInputs),
        });
        res.status(201).json(success({ data: service }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const editService = async (req: IFileRequest<CreateServiceDTO, { id: string }>, res, next) => {
    try {
        const newCover = req.files?.cover;
        const { title, description, category, priceInputs, cover: oldCover } = req.body;
        const { id } = req.params;

        let coverUrl;

        if (newCover) {
            const cloudImage = await uploadImage(newCover);
            coverUrl = cloudImage?.secure_url;
        } else {
            coverUrl = oldCover;
        }

        const isExist = await Service.findOne({ _id: id });
        if (!isExist) {
            return res.status(404).json(failed({ issue: "Service not found" }));
        }
        const service = await Service.findOneAndUpdate({ _id: id }, {
            title,
            description,
            cover: coverUrl,
            category: JSON.parse(category),
            priceInputs: JSON.parse(priceInputs),
        }, { new: true })
        res.status(201).json(success({ data: service }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const changeServiceStatus = async (req: IAuthRequest<ChangeServiceStatusDTO, { id: string }>, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!Object.values(ServiceStatus).includes(status)) {
            return res.status(400).json(failed({ issue: "Invalid status" }));
        }

        const service = await Service.findOneAndUpdate({ _id: id }, {
            status,
        }, { new: true })

        res.status(201).json(success({ data: service }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const deleteService = async (req: IAuthRequest<CreateServiceDTO, { id: string }>, res, next) => {
    try {
        const { id } = req.params;
        const isExist = await Service.findOne({ _id: id });
        if (!isExist) {
            return res.status(404).json(failed({ issue: "Service not found" }));
        }
        await Service.deleteOne({ _id: id });
        res.status(201).json(success({ message: "Service deleted successfully" }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};