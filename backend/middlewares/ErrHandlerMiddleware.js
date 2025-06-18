import { logger } from "./LoggerMiddleware.js";

export const errHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    stack: err.stack,
  });
};
