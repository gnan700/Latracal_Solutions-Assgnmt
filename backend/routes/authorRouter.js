import express from "express";
import {
  createAuthor,
  getAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
} from "../controllers/author.js";
import userAuth from "../middlewares/AuthMiddleware.js";
import validate from "../middlewares/ValidationMiddleware.js";
import { authorValidation } from "../validations/AuthorValidation.js";
import { logger } from "../middlewares/LoggerMiddleware.js";

const authorRouter = express.Router();

authorRouter.post(
  "/create",
  userAuth,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      logger.warn(`Unauthorized attempt to create author by: ${req.user.id}`);
      return res
        .status(403)
        .send({ status: "failed", message: "Access denied" });
    }
    next();
  },
  authorValidation,
  validate,
  createAuthor
);

authorRouter.get("/", getAuthors);

authorRouter.get("/:id", getAuthorById);

authorRouter.put(
  "/:id",
  userAuth,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      logger.warn(`Unauthorized attempt to update author by: ${req.user.id}`);
      return res
        .status(403)
        .send({ status: "failed", message: "Access denied" });
    }
    next();
  },
  authorValidation,
  validate,
  updateAuthor
);

authorRouter.delete(
  "/:id",
  userAuth,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      logger.warn(`Unauthorized attempt to delete author by: ${req.user.id}`);
      return res
        .status(403)
        .send({ status: "failed", message: "Access denied" });
    }
    next();
  },
  deleteAuthor
);

export default authorRouter;
