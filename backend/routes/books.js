import express from "express";
import booksController from "../controllers/books.js";
import userAuth from "../middlewares/AuthMiddleware.js";
import { logger } from "../middlewares/LoggerMiddleware.js";
import upload from "../middlewares/multer.js";
import validate from "../middlewares/ValidationMiddleware.js";
import { bookValidation } from "../validations/BookValidation.js";

const booksRouter = express.Router();

booksRouter.post(
  "/",
  userAuth,
  upload.single("Image"),
  bookValidation,
  validate,
  async (req, res, next) => {
    if (req.user.role !== "admin") {
      logger.warn(`Unauthorized user list access attempt by: ${req.user.id}`);
      return res
        .status(403)
        .send({
          status: "failed",
          data: "You do not have permission to perform this action.",
        });
    }

    await booksController
      .create(req.body)
      .then((data) => {
        logger.info(`Admin with id [${req.user.id}] created a new book`);
        res.status(200).send({ status: "success", data: data });
      })
      .catch((error) => next(error));
  }
);

booksRouter.get('/', async (req, res, next) => {
  const limit = req.query.limit || 4;
  const skip = ((req.query.page || 1) - 1) * limit;
  await booksController.getMany(req.body, skip, limit)
    .then(data => {
      logger.info(`User read books data`);
      res.status(200).send({ status: "success", data: data })
    }).catch(error => next(error));
});

booksRouter.get("/:id", userAuth, async (req, res, next) => {
  await booksController
    .getById(req.params.id)
    .then((data) => {
      logger.info(
        `User with id [${req.user.id}] read book data with id: [${req.params.id}]`
      );
      res.status(200).send({ status: "success", data: data });
    })
    .catch((error) => next(error));
});

booksRouter.get("/:id/reviews", userAuth, async (req, res, next) => {
  await booksController
    .getReviews(req.params.id)
    .then((data) => {
      logger.info(
        `User with id [${req.user.id}] read book reviews with id: [${req.params.id}]`
      );
      res.status(200).send({ status: "success", data: data });
    })
    .catch((error) => next(error));
});

booksRouter.patch("/:id", userAuth, async (req, res, next) => {
  if (req.user.role !== "admin") {
    logger.warn(`Unauthorized user list access attempt by: ${req.user.id}`);
    return res
      .status(403)
      .send({
        status: "failed",
        data: "You do not have permission to perform this action.",
      });
  }

  await booksController
    .update(req.params.id, ...req.body)
    .then((data) => {
      logger.info(
        `Admin with id [${req.user.id}] updated a book with id: [${req.params.id}]`
      );
      res.status(200).send({ status: "success", data: req.body });
    })
    .catch((error) => next(error));
});

booksRouter.delete("/:id", userAuth, async (req, res, next) => {
  if (req.user.role !== "admin") {
    logger.warn(`Unauthorized user list access attempt by: ${req.user.id}`);
    return res
      .status(403)
      .send({
        status: "failed",
        data: "You do not have permission to perform this action.",
      });
  }

  await booksController
    .remove(req.params.id)
    .then((data) => {
      logger.info(
        `Admin with id [${req.user.id}] deleted a book with id: [${req.params.id}]`
      );
      res.status(200).send({ status: "success", data: data });
    })
    .catch((error) => next(error));
});

export default booksRouter;
