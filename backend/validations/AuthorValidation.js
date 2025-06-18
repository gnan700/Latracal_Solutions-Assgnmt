import { body } from "express-validator";

export const authorValidation = [
  body("Name")
    .trim()
    .notEmpty()
    .withMessage("Name is Required")
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),

  body("Email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address"),
];
