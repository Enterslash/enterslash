import { GetRoomsDTO, IAuthRequest, IRoomIdentifiers, JoinRoomDTO, RoomType, Select } from "@enterslash/enterus/types";
import { failed, success } from "../utils/response";
import { logger } from "../middleware/logger/logger";
import Subject from "../models/Subject";
import Room from "../models/Room";
import Participant from "../models/Participant";

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

export const joinRoom = async (req: IAuthRequest<JoinRoomDTO>, res, next) => {
    try {
        const { batch, subject, section, course, code } = req.body;
        const user = req.user;
        const identifier = `${batch}-${subject}-${section}-${course}-${code}`.replace(/" "/i, "-").toLowerCase();

        let roomInfo = await Room.findOne({
            roomId: identifier,
        })

        if (roomInfo) {
            const joined = await Participant.findOne({
                user: user._id,
                room: roomInfo._id,
            })
            if (joined) {
                return res.status(500).json(failed({ issue: "You have already joined this group" }));
            } else {
                const newParticipant = new Participant({
                    user: user._id,
                    room: roomInfo._id,
                })
                await newParticipant.save();
            }
        } else {
            const newRoom = new Room({
                roomId: identifier,
                roomType: RoomType.GROUP,
            })
            roomInfo = await newRoom.save();

            const newParticipant = new Participant({
                user: req.user._id,
                room: newRoom._id,
            })
            await newParticipant.save();
        }

        return res.status(200).json(success({
            data: roomInfo
        }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
}

export const getRooms = async (req: IAuthRequest, res, next) => {
    try {
        const rooms = await Room.aggregate([
            {
                $lookup: {
                    from: "participants",
                    localField: "_id",
                    foreignField: "room",
                    as: "participants",
                }
            },
            {
                $match: {
                    "participants.user": req.user._id,
                }
            },
            {
                $project: {
                    _id: 1,
                    roomId: 1,
                    roomType: 1,
                } as Select<GetRoomsDTO>
            }
        ])

        return res.status(200).json(success({
            data: rooms
        }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
}

export const getSingleRoom = async (req: IAuthRequest<null, { roomId: string }>, res, next) => {
    try {
        const room = await Room.findById(req.params.roomId)
        return res.status(200).json(success({
            data: room
        }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
}