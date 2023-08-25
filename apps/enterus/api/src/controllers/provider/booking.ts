import { IAuthRequest, Select, GetProviderBookingsDTO, BookingStatus, MessageType, SetBookingPriceDTO, BookingType, NotificationType } from "@enterslash/enterus/types";
import { Types } from "mongoose";
import Booking from "../../models/Booking";
import { success, failed } from "../../utils/response";
import ServiceHistory from "../../models/ServiceHistory";
import Message from "../../models/Message";
import { startOfThisMonth, endOfThisMonth, startOfThisWeek, endOfThisWeek, diffInDays } from "@enterslash/utils";
import { AppLinks } from "@enterslash/enterus/utils";
import { createNotification } from "../../utils/create-notification";
import { emitNotificationMessage } from "../../listeners";
import { logger } from "../../middleware/logger/logger";

type Filter = {
    limit?: number;
    skip?: number;
    tab?: number;
};


export const getAllBookings = async (req: IAuthRequest, res, next) => {
    try {
        const id = req.user._id;
        const { limit, skip, tab }: Filter = req.query;

        const SelectBookingsDTO: Select<GetProviderBookingsDTO> = {
            _id: 1,
            date: 1,
            location: {
                name: 1,
            },
            service: {
                _id: 1,
                title: 1,
                cover: 1,
            },
            user: {
                _id: 1,
                avatar: 1,
                username: 1,
            },
            priceInputs: 1,
            status: 1,
        }

        const matchFilter = {
            0: BookingStatus.PENDING,
            1: BookingStatus.ACCEPTED,
            2: BookingStatus.COMPLETED,
        }[tab];

        const services = await Booking.aggregate([
            {
                $match: {
                    provider: new Types.ObjectId(id),
                    status: matchFilter,
                }
            },
            {
                $lookup: {
                    from: "services",
                    localField: "service",
                    foreignField: "_id",
                    as: "service",
                },
            },
            { $unwind: "$service" },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: SelectBookingsDTO,
            },
            {
                $sort: {
                    _id: -1
                },
            },
            // {
            //     $skip: skip || 0,
            // },
            // {
            //     $limit: limit || 20,
            // },
        ])
        res.status(201).json(success({ data: services }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const confirmBooking = async (req: IAuthRequest<null, { bookingId: string }>, res, next) => {
    try {
        const { bookingId } = req.params

        const bookingData = await Booking.findById(bookingId).populate("service");

        if (bookingData.date.mode === BookingType.ONE_TIME) {
            const history = await ServiceHistory.find({ booking: bookingId })
            if (history.length > 0) {
                return res.status(400).json(failed({ issue: "Booking already completed!" }));
            } else {
                await Booking.findOneAndUpdate({ _id: bookingId }, {
                    status: BookingStatus.COMPLETED
                })
            }
        } else {
            if (bookingData.date.end && (bookingData.date.end.getTime() > Date.now())) {
                return res.status(400).json(failed({ issue: "Booking has been end!" }));
            } else {
                if (bookingData.date.mode === BookingType.MONTHLY) {
                    const history = await ServiceHistory.find({
                        booking: bookingId,
                        date: {
                            $gte: startOfThisMonth(),
                            $lte: endOfThisMonth()
                        }
                    })
                    if (history.length > 0) {
                        return res.status(400).json(failed({ issue: "Booking already completed for this month!" }));
                    }
                } else if (bookingData.date.mode === BookingType.WEEKLY) {
                    const history = await ServiceHistory.find({
                        booking: bookingId,
                        date: {
                            $gte: startOfThisWeek(),
                            $lte: endOfThisWeek()
                        }
                    })
                    if (history.length > 0) {
                        return res.status(400).json(failed({ issue: "Booking already completed for this week!" }));
                    }
                } else if (bookingData.date.mode === BookingType.BI_WEEKLY) {
                    const history = await ServiceHistory.find({ booking: bookingId }).sort({
                        date: -1
                    }).limit(1)
                    if (history.length > 0) {
                        const diff = diffInDays(history[0].date, new Date())
                        if (diff < 14) {
                            return res.status(400).json(failed({ issue: "The service will be active in" + (14 - diff) + "days" }));
                        }
                    }
                }
            }
        }

        const newMessage = {
            title: bookingData.service.title,
            link: AppLinks.message(bookingId),
            type: NotificationType.BOOKING,
            ref: bookingId,
            booking: bookingId,
            message: "Service completed!",
            receiver: bookingData.user,
            sender: req.user._id,
        }
        emitNotificationMessage(bookingId, newMessage)
        const confirmBooking = new ServiceHistory({
            booking: bookingId,
            date: new Date(),
        })
        await confirmBooking.save();

        res.status(201).json(success({ message: "Booking confirmed!" }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const handleBooking = async (req: IAuthRequest<null, { bookingId: string, status: BookingStatus }>, res, next) => {
    try {
        const { bookingId, status } = req.params

        const booking = await Booking.findById(bookingId)

        if (booking.status === BookingStatus.COMPLETED) {
            return res.status(400).json(failed({ issue: "Can't update completed booking!" }));
        }

        if (![BookingStatus.ACCEPTED, BookingStatus.REJECTED].includes(status)) {
            return res.status(400).json(failed({ issue: "Invalid status" }));
        }
        const confirmBooking = await Booking.findOneAndUpdate({ _id: bookingId }, {
            status
        }, { new: true }).populate("service");

        let message = "You have an update on your booking!";

        if (status === BookingStatus.ACCEPTED) {
            message = "Booking has been accepted!";
        } else if (status === BookingStatus.REJECTED) {
            message = "Booking has been rejected!";
        }

        const newMessage = {
            title: confirmBooking.service.title,
            link: AppLinks.message(bookingId),
            type: NotificationType.BOOKING,
            ref: bookingId,
            booking: bookingId,
            message,
            receiver: confirmBooking.user,
            sender: req.user._id,
        }
        emitNotificationMessage(bookingId, newMessage)
        res.status(201).json(success({ message: `Booking updated!` }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};

export const setBookingPrice = async (req: IAuthRequest<SetBookingPriceDTO, { bookingId: string }>, res, next) => {
    try {
        const { bookingId } = req.params
        const { price } = req.body

        const booking = await Booking.findById(bookingId).populate("service");

        if (price > 0) {
            await Booking.findOneAndUpdate({ _id: bookingId }, {
                price: {
                    amount: price,
                    acceptedByProvider: true,
                }
            })
        } else {
            return res.status(400).json(failed({ issue: "Invalid price" }));
        }

        const newMessage = {
            title: booking.service.title,
            link: AppLinks.chatOptions(bookingId),
            type: NotificationType.BOOKING,
            ref: bookingId,
            booking: bookingId,
            message: "Provider has set the price for your booking! Please check it out!",
            receiver: booking.user,
            sender: req.user._id,
        }
        emitNotificationMessage(bookingId, newMessage)
        res.status(201).json(success({ message: `Booking price added!` }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};