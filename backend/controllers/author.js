import Author from "../models/AuthorModel.js";
import { logger } from "../middlewares/LoggerMiddleware.js";

export const createAuthor = async (req, res, next) => {
  try {
    const newAuthor = new Author(req.body);
    await newAuthor.save();
    logger.info(`New author created: ${newAuthor.Name}`);
    res.status(201).send({ status: "success", data: newAuthor });
  } catch (error) {
    next(error);
  }
};

export const getAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find();
    res.status(200).send({ status: "success", data: authors });
  } catch (error) {
    next(error);
  }
};

export const getAuthorById = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res
        .status(404)
        .send({ status: "failed", message: "Author not found" });
    }
    res.status(200).send({ status: "success", data: author });
  } catch (error) {
    next(error);
  }
};

export const updateAuthor = async (req, res, next) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAuthor) {
      return res
        .status(404)
        .send({ status: "failed", message: "Author not found" });
    }
    logger.info(`Author updated: ${updatedAuthor.Name}`);
    res.status(200).send({ status: "success", data: updatedAuthor });
  } catch (error) {
    next(error);
  }
};

export const deleteAuthor = async (req, res, next) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) {
      return res
        .status(404)
        .send({ status: "failed", message: "Author not found" });
    }
    logger.info(`Author deleted: ${deletedAuthor.Name}`);
    res.status(200).send({ status: "success", message: "Author deleted" });
  } catch (error) {
    next(error);
  }
};
