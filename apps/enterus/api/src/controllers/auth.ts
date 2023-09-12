import { v4 as uuid } from "uuid";
import { createToken } from "../utils/jwt";
import bcrypt from "bcryptjs";
import UserSession from "../models/UserSession";
import User from "../models/User";
import { IAuthRequest, IRequest, LoginDTO, RegisterDTO, UserType } from "@enterslash/enterus/types";
import { failed, success } from "../utils/response";
import FCM from "../models/FCM";
import { logger } from "../middleware/logger/logger";

// Registration API
export const registration = async (req: IRequest<RegisterDTO>, res, next) => {
  try {
    // Get user input
    const { username, password, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(failed({ issue: "User already exists" }));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      password: hashedPassword,
      email,
    });
    await user.save();

    // Create and send JWT token
    const sessionUUID = uuid();
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 30);
    const sessionStructure = new UserSession({
      user: user._id,
      sessionUUID,
      expireDate,
      verified: false,
    });

    const session = await sessionStructure.save();
    const jwtToken = createToken(session._id, session.sessionUUID);
    return res.status(201).json(success({ data: { jwtToken, user } }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

// Login API
export const login = async (req: IRequest<LoginDTO>, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(404).json(failed({ issue: "User not found" }));
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json(failed({ issue: "Invalid credentials" }));
    }

    // Create and send JWT token
    const sessionUUID = uuid();
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 30);
    const sessionStructure = new UserSession({
      user: existingUser._id,
      sessionUUID,
      expireDate,
      verified: false,
    });

    const session = await sessionStructure.save();
    const jwtToken = createToken(session._id, session.sessionUUID);
    return res.status(200).json(success({ data: { jwtToken, user: existingUser } }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

// Logout
export const logout = async (req: IAuthRequest, res) => {
  try {
    const sessionId = req.session;

    await FCM.findOneAndRemove({ session: sessionId });

    await UserSession.findOneAndRemove({ sessionUUID: sessionId });

    return res.status(200).json(success({ message: "Logged out" }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
}
