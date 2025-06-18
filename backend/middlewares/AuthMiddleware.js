import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { logger } from "./LoggerMiddleware.js";

dotenv.config();

const userAuth = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    const error = "Not authorized, token missing";
    logger.warn(`${req.method} ${req.url} - ${error}`);
    res.status(401);
    return next(error);
  }

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    logger.info(`${req.method} ${req.url} - User authenticated: ${decoded.id}`);
    next();
  } catch (error) {
    const errorMessage = "Unauthorized access - Invalid Token";
    logger.warn(`${req.method} ${req.url} - ${errorMessage}`);
    res.status(401);
    return next(new Error("Invalid Token"));
  }
};

export default userAuth;
