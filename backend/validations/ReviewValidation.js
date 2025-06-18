import { body } from "express-validator";

export const reviewValidation = [
  body("UserID")
    .trim()
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID"),

  body("BookID")
    .trim()
    .notEmpty()
    .withMessage("Book ID is required")
    .isMongoId()
    .withMessage("Invalid Book ID"),

  body("Rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("Review")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Review cannot exceed 500 characters"),
];
