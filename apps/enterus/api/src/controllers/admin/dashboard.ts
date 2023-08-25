import { IAuthRequest, UserType } from '@enterslash/enterus/types';
import Booking from '../../models/Booking';
import { failed, success } from '../../utils/response';
import User from '../../models/User';
import { PipelineStage } from 'mongoose';

export const getDashboardData = async (req: IAuthRequest, res, next) => {
  try {
    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    const userType = req.user.userType;
    const isProvider = userType.includes(UserType.PROVIDER);
    const isAdmin = userType.includes(UserType.SUPER_ADMIN);
    const id = req.user._id;

    const pipeline: PipelineStage[] = [
      // Match bookings within the last 7 days
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo, $lte: currentDate },
        },
      },
      {
        $match: {
          'price.acceptedByUser': true,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%d-%m-%Y', date: '$createdAt' } },
          totalBookingsLast7Days: { $sum: 1 },
          earningsForDay: { $sum: '$price.amount' },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },

      {
        $group: {
          _id: null,
          bookingsLast7Days: { $sum: '$totalBookingsLast7Days' },
          bookingsByDay: {
            $push: {
              date: '$_id',
              totalBookings: '$totalBookingsLast7Days',
              earningsForDay: '$earningsForDay',
            },
          },
          totalEarnings: { $sum: '$earningsForDay' },
          totalBookings: { $sum: '$totalBookingsLast7Days' },
        },
      },

      {
        $project: {
          _id: 0,
          bookingsLast7Days: 1,
          bookingsByDay: 1,
          totalEarnings: 1,
          totalBookings: 1,
        },
      },
    ];

    if (isProvider) {
      pipeline.unshift({
        $match: {
          provider: id,
        },
      });
      const result = await Booking.aggregate(pipeline);
      res.status(201).json(success({ data: { ...result[0] } }));
    }
    if (isAdmin) {
      const totalUser = await User.countDocuments({
        userType: UserType.CONSUMER,
      });
      const result = await Booking.aggregate(pipeline);
      res.status(201).json(success({ data: { ...result[0], totalUser } }));
    }

    // res.status(201).json(success({ data: { ...result[0], totalUser } }));
  } catch (error) {
    res.status(500).json(failed({ issue: error.message }));
  }
};
