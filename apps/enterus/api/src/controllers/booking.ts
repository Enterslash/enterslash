import {
  AcceptedBookingPrice,
  BookServiceDTO,
  BookingPriceStatus,
  BookingStatus,
  BookingType,
  GetConsumerBookingsDTO,
  GetSingleBookingsDTO,
  IAuthRequest,
  IFileRequest,
  IRequest,
  MessageType,
  NotificationType,
  Select,
  UserType,
} from '@enterslash/enterus/types';
import Booking from '../models/Booking';
import { failed, success } from '../utils/response';
import { uploadImage } from '../utils/file';
import { PipelineStage, Types } from 'mongoose';
import Message from '../models/Message';
import { stripe } from '../utils/stripe';
import { AppLinks } from '@enterslash/enterus/utils';
import Service from '../models/Service';
import { createNotification } from '../utils/create-notification';
import User from '../models/User';
import { ioRef } from '../config/socket';
import { emitNotificationMessage } from '../listeners';
import { logger } from '../middleware/logger/logger';

export const bookService = async (
  req: IFileRequest<BookServiceDTO, { id: string }>,
  res
) => {
  try {
    const { id } = req.params;
    const images = req.files?.images;
    const userId = req.user._id;
    const { date, location, priceInputs } = req.body;
    const imageUrls = [];

    try {
      if (images) {
        if (Array.isArray(images)) {
          await Promise.all(
            images.map(async (image) => {
              const { secure_url } = await uploadImage(image);
              imageUrls.push(secure_url);
            })
          );
        } else {
          const { secure_url } = await uploadImage(images);
          imageUrls.push(secure_url);
        }
      }
    } catch (error) {
      logger.error(error);
      return res.status(500).json(failed({ issue: error.message }));
    }

    const superUser = await User.findOne({
      userType: UserType.SUPER_ADMIN,
    });

    const newBooking = new Booking({
      service: id,
      provider: superUser._id,
      status: BookingStatus.PENDING,
      user: userId,
      date: JSON.parse(date as string),
      images: imageUrls,
      location: JSON.parse(location as string),
      // priceInputs: JSON.parse(priceInputs as string),
    });

    const booking = await newBooking.save();

    const service = await Service.findById(id);

    createNotification({
      title: service.title,
      body: 'You have a new booking request!',
      userId: superUser._id,
      link: AppLinks.order(),
      ref: booking._id,
      type: NotificationType.BOOKING,
    });
    return res.status(200).json(success({ data: booking }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

type Filter = {
  limit?: number;
  skip?: number;
  tab?: number;
};

export const getMyBookings = async (req: IAuthRequest, res, next) => {
  try {
    const id = req.user._id;
    const { limit, skip, tab }: Filter = req.query;
    const userType = req.user.userType;
    const IsSuperAdmin = userType.includes(UserType.SUPER_ADMIN);

    const SelectBookingsDTO: Select<GetConsumerBookingsDTO> = {
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
      provider: {
        _id: 1,
        avatar: 1,
        firstName: 1,
        lastName: 1,
      },
      priceInputs: 1,
      status: 1,
    };
  
    const matchFilter = {
      0: BookingStatus.PENDING,
      1: BookingStatus.ACCEPTED,
      2: BookingStatus.COMPLETED,
    }[tab];

    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'service',
        },
      },
      {
        $match: {
          status: matchFilter,
        },
      },
      { $unwind: '$service' },
      {
        $lookup: {
          from: 'users',
          localField: 'provider',
          foreignField: '_id',
          as: 'provider',
        },
      },
      { $unwind: '$provider' },
      {
        $project: SelectBookingsDTO,
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $skip: +skip || 0,
      },
      {
        $limit: +limit || 20,
      },
    ];
    if (!IsSuperAdmin) {
      pipeline.unshift({
        $match: {
          user: new Types.ObjectId(id),
        },
      });
    }
    const services = await Booking.aggregate(pipeline);
    res.status(201).json(success({ data: services }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const getSingleBooking = async (
  req: IRequest<null, { bookingId: string }>,
  res,
  next
) => {
  try {
    const { bookingId } = req.params;

    const services = await Booking.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(bookingId),
        },
      },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'service',
        },
      },
      { $unwind: '$service' },
      {
        $lookup: {
          from: 'users',
          localField: 'provider',
          foreignField: '_id',
          as: 'provider',
        },
      },
      { $unwind: '$provider' },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          date: 1,
          location: {
            name: 1,
          },
          service: {
            _id: 1,
            title: 1,
            cover: 1,
            description: 1,
          },
          provider: {
            _id: 1,
            avatar: 1,
            firstName: 1,
            email: 1,
            lastName: 1,
            location: 1,
          },
          user: {
            _id: 1,
            avatar: 1,
            firstName: 1,
            email: 1,
            lastName: 1,
          },
          images: 1,
          priceInputs: 1,
          status: 1,
          price: 1,
        } as Select<GetSingleBookingsDTO>,
      },
    ]);
    res.status(201).json(success({ data: services?.[0] }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const handleBookingPrice = async (
  req: IAuthRequest<
    AcceptedBookingPrice,
    { bookingId: string; status: string }
  >,
  res,
  next
) => {
  try {
    const { bookingId, status } = req.params;
    const userId = req.user._id;

    if (status === BookingPriceStatus.ACCEPTED) {
      const payId = req.body.payId;
      const bookingData = await Booking.findOneAndUpdate(
        { _id: bookingId },
        {
          payId,
          'price.acceptedByUser': true,
        },
        { new: true }
      );

      const message = {
        title: bookingData.service.title,
        link: AppLinks.chatOptions(bookingId),
        ref: bookingData._id.toString(),
        booking: bookingId,
        message: 'User has accepted the price!',
        receiver: bookingData.provider,
        sender: userId,
        type: NotificationType.BOOKING,
      };
      emitNotificationMessage(bookingId, message);
      res.status(201).json(success({ message: `Booking price accepted!` }));
    } else if (status === BookingPriceStatus.REJECTED) {
      const bookingData = await Booking.findOneAndUpdate(
        { _id: bookingId },
        {
          status: BookingStatus.CANCELLED,
        }
      ).populate('service');

      const message = {
        title: bookingData.service.title,
        link: AppLinks.chatOptions(bookingId),
        ref: bookingData._id.toString(),
        booking: bookingId,
        message: 'User has rejected the price!',
        receiver: bookingData.provider,
        sender: userId,
        type: NotificationType.BOOKING,
      };
      emitNotificationMessage(bookingId, message);
      res.status(201).json(success({ message: `Booking price rejected!` }));
    } else {
      res.status(400).json(failed({ issue: `Invalid status!` }));
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const handleBookingStatus = async (
  req: IAuthRequest<null, { bookingId: string; status: string }>,
  res,
  next
) => {
  try {
    const { bookingId, status } = req.params;
    const userId = req.user._id;

    if (status === BookingStatus.PAUSED) {
      const bookingData = await Booking.findOneAndUpdate(
        { _id: bookingId },
        {
          status: BookingStatus.PAUSED,
        },
        { new: true }
      );

      if (bookingData.date.mode === BookingType.ONE_TIME) {
        return res
          .status(400)
          .json(failed({ issue: `You can't pause one time booking!` }));
      }

      await stripe.subscriptions.update(bookingData.payId, {
        pause_collection: {
          behavior: 'void',
        },
      });

      const newMessage = {
        title: bookingData.service.title,
        link: AppLinks.message(bookingId),
        type: NotificationType.BOOKING,
        ref: bookingId,
        booking: bookingId,
        message: 'User has paused the booking!',
        receiver: bookingData.provider,
        sender: userId,
      };
      emitNotificationMessage(bookingId, newMessage);
      res
        .status(200)
        .json(success({ message: `You have paused the booking!` }));
    } else if (status === BookingPriceStatus.ACCEPTED) {
      const bookingData = await Booking.findOneAndUpdate(
        { _id: bookingId },
        {
          status: BookingStatus.ACCEPTED,
        },
        { new: true }
      );

      if (bookingData.date.mode === BookingType.ONE_TIME) {
        return res
          .status(400)
          .json(failed({ issue: `You can't pause one time booking!` }));
      }

      await stripe.subscriptions.update(bookingData.payId, {
        pause_collection: '',
      });

      const newMessage = {
        title: bookingData.service.title,
        link: AppLinks.message(bookingId),
        type: NotificationType.BOOKING,
        ref: bookingId,
        booking: bookingId,
        message: 'User has reactivated the booking!',
        receiver: bookingData.provider,
        sender: userId,
      };
      emitNotificationMessage(bookingId, newMessage);
      res
        .status(200)
        .json(success({ message: `You have resumed the booking!` }));
    } else {
      res.status(400).json(failed({ issue: `Invalid status!` }));
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};
