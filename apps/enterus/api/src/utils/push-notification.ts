import { firebase } from '../firebase/index'
import FCM from '../models/FCM';
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { Types } from 'mongoose';
import { logger } from '../middleware/logger/logger';

interface PushNotificationDTO {
  title: string;
  body: string;
  users?: string[];
  link?: string;
}

export const pushNotification = async ({ title, body, users, link }: PushNotificationDTO) => {
  try {
    const fcm = await FCM.aggregate([
      {
        $match: {
          user: {
            $in: users.map((id) => new Types.ObjectId(id))
          }
        }
      },
      {
        $lookup: {
          from: 'usersessions',
          foreignField: '_id',
          localField: 'session',
          as: 'session'
        }
      },
      {
        $match: {
          "session.expireDate": { "$gte": new Date() }
        }
      },
      {
        $project: {
          token: 1
        }
      }
    ])

    title = title || "Enterus";
    body = body || "You got a new notification";

    const tokens = fcm.map((f) => f.token);

    if (!tokens.length) {
      return null
    }

    const message = {
      data: {
        title,
        body: JSON.stringify({
          message: body,
          link,
        }),
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
          },
        },
        headers: {
          'apns-push-type': 'background',
          'apns-priority': '5',
          'apns-topic': 'com.enterslash.enterus',
        },
      },
      android: {
        priority: 'high',
      },
      tokens,
    };

    const result = firebase.messaging().sendEachForMulticast(message as MulticastMessage);
    return result;
  } catch (err) {
    logger.error(err);
    return err;
  }
};
