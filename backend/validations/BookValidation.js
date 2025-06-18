import { body } from "express-validator";

export const bookValidation = [
  body("Title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 10 })
    .withMessage("Title must be at least 10 characters"),

  body("Authors_IDs")
    .isArray({ min: 1 })
    .withMessage("At least one author is required"),

  body("Desc")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("Stock").isInt({ min: 0 }).withMessage("Stock cannot be negative"),

  body("Image")
    .optional()
    .matches(/\.(jpg|jpeg|png|gif)$/)
    .withMessage("Invalid image format"),

  body("Price").isFloat({ min: 0 }).withMessage("Price cannot be negative"),
];
