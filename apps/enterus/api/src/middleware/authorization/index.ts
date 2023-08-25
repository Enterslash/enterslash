import UserSession from "../../models/UserSession";
import { parseJWT } from "../../utils/jwt";
import { failed } from "../../utils/response";
import { logger } from "../logger/logger";

export const userAuthorization = async (req, res, next) => {
  try {
    let message = "";
    let token =
      req.headers.authorization ||
      (req.query.authorization
        ? `Bearer ${req.query.authorization}`
        : undefined);
    if (token) {
      token = token.split(" ")[1];
      const jwt_payload = parseJWT(token);
      if (!jwt_payload.error) {
        if (jwt_payload.sessionId) {
          const loginSession = await UserSession.findOne({
            $and: [
              { _id: jwt_payload.sessionId },
              { sessionUUID: jwt_payload.sessionUUID },
            ],
          }).populate({
            path: "user",
          });
          if (loginSession) {
            if (loginSession.expireDate > new Date()) {
              const user = loginSession.user;
              if (user) {
                req.user = user;
                req.session = loginSession._id;
                return next();
              } else {
                message = "User doesn't exist!";
              }
            } else {
              message = "Session expired!";
            }
          } else {
            message = "Invalid token!";
          }
        } else {
          message = "Invalid token";
        }
      } else {
        message = jwt_payload.error;
      }
    } else {
      message = "Authorization token is required!";
    }
    return res.status(401).json(failed({ issue: message }));
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
