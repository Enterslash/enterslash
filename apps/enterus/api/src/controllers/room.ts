import { IAuthRequest, IRoomIdentifiers } from "@enterslash/enterus/types";
import { failed, success } from "../utils/response";
import { logger } from "../middleware/logger/logger";
import Subject from "../models/Subject";

export const getRoomIdentifiers = async (req: IAuthRequest, res, next) => {
    try {
        const sectionNumber = Array.from({ length: 30 }).map((_, i) => i)

        const section = [
            ...sectionNumber.map((i) => ({
                label: `D${i + 1}`,
                value: `d${i + 1}`,
            })),
            ...sectionNumber.map((i) => ({
                label: `E${i + 1}`,
                value: `e${i + 1}`,
            })),
        ]

        const subjects = await Subject.find({});

        const identifiers: IRoomIdentifiers = {
            section: section,
            subject: subjects.map((subject) => ({
                label: subject.name,
                value: subject._id.toString(),
            })),
        }

        return res.status(200).json(success({ data: identifiers }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
}