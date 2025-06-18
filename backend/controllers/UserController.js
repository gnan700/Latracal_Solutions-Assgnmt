import bcrypt from "bcrypt";
import User from "../models/UserModel.js";
import Review from "../models/ReviewModel.js";
import Order from "../models/OrderModel.js";
import { logger } from "../middlewares/LoggerMiddleware.js";
import { generateToken } from "../utils/tokenUtil.js";
import sendEmail from '../services/mail.js';

export const regUsr = async (req, res, next) => {
  try {
    const { Name, Email, Password, Role } = req.body;

    const exists = await User.findOne({ Email });

    if (exists) {
      logger.warn(`Registration failed - Email already in use: ${Email}`);
      return res
        .status(400)
        .json({ status: "error", message: "User already exists" });
    }

    const newUser = new User({ Name, Email, Password, Role });
    await newUser.save();

    const token = generateToken({ id: newUser._id, role: newUser.Role });
    if (Role === 'customer') sendEmail(Email, 'Welcome to our store', `Dear ${Name},\nWe are pleased to have you in our store.`);
    logger.info(`User registered successfully: ${Email}`);
    res.status(201).json({
      status: "success",
      data: { user: { id: newUser._id, Name, Email, Role }, token },
    });
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    next(error);
  }
};

export const LoginUsr = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;

    const user = await User.findOne({ Email });
    if (!user) {
      logger.warn(`Login failed - User not found: ${Email}`);
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(Password);
    if (!isMatch) {
      logger.warn(`Login failed - Incorrect password for: ${Email}`);
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials" });
    }

    const token = generateToken({ id: user._id, role: user.Role });

    logger.info(`User logged in successfully: ${Email}`);
    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          Name: user.Name,
          Email: user.Email,
          Role: user.Role,
        },
        token,
      },
    });
  } catch (error) {
    logger.error(`Error logging in user: ${error.message}`);
    next(error);
  }
};

export const LogOut = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "success",
      message: "Logged out successfully, remove token on client-side",
    });
  } catch (error) {
    logger.error(`Error logging out: ${error.message}`);
    next(error);
  }
};

export const updateUsr = async (req, res, next) => {
  try {
    const { id } = req.params;

    let user = await User.findById(id);

    if (!user) {
      logger.warn(`Update failed - User not found: ${id}`);
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    if (req.user.id !== id && req.user.role !== "admin") {
      logger.warn(`Unauthorized profile update attempt: ${req.user.id}`);
      return res.status(403).json({ status: "error", message: "Unauthorized" });
    }

    if (req.body.Password) {
      const salt = await bcrypt.genSalt(10);
      req.body.Password = await bcrypt.hash(req.body.Password, salt);
    }

    user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    logger.info(`User updated successfully: ${id}`);
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`);
    next(error);
  }
};

export const getUsrsPag = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      logger.warn(`Unauthorized user list access attempt by: ${req.user.id}`);
      return res
        .status(403)
        .json({ status: "error", message: "Access denied" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);
    const totalUsers = await User.countDocuments();

    logger.info(`Retrieved users list - Page: ${page}`);
    res.status(200).json({
      status: "success",
      data: { users, totalPages: Math.ceil(totalUsers / limit) },
    });
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      logger.warn(`Unauthorized user detail access attempt by: ${req.user.id}`);
      return res.status(403).json({ status: "error", message: "Unauthorized" });
    }

    const user = await User.findById(id);
    if (!user) {
      logger.warn(`User not found: ${id}`);
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    logger.info(`User details retrieved: ${id}`);
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    logger.error(`Error fetching user: ${error.message}`);
    next(error);
  }
};

export const getUserReviews = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== "admin") {
      logger.warn(
        `Unauthorized review history access attempt by: ${req.user.id}`
      );
      return res.status(403).json({ status: "error", message: "Unauthorized" });
    }

    const reviews = await Review.find({ UserID: id }).populate(
      "BookID",
      "Author"
    );

    logger.info(`User review history retrieved: ${id}`);
    res.status(200).json({ status: "success", data: reviews });
  } catch (error) {
    logger.error(`Error fetching user reviews: ${error.message}`);
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== "admin") {
      logger.warn(
        `Unauthorized order history access attempt by: ${req.user.id}`
      );
      return res.status(403).json({ status: "error", message: "Unauthorized" });
    }

    const orders = await Order.find({ User_ID: id }).populate("Books", "Price");

    logger.info(`User order history retrieved: ${id}`);
    res.status(200).json({ status: "success", data: orders });
  } catch (error) {
    logger.error(`Error fetching user orders: ${error.message}`);
    next(error);
  }
};
