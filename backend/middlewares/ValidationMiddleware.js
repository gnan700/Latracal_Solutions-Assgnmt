import { validationResult } from "express-validator";
import { logger } from "./LoggerMiddleware.js";

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    logger.warn(`Validation Error: ${JSON.stringify(err.array())}`);
    return res.status(400).json({ status: "error", errors: err.array() });
  }
  next();
};

export default validate;
