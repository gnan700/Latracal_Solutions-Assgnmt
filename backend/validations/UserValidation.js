import { body } from "express-validator";

export const regValidation = [
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

  body("Password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("Role")
    .optional()
    .isIn(["admin", "customer"])
    .withMessage("Role must be either 'admin' or 'customer'"),
];

export const loginValidation = [
  body("Email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("Password").trim().notEmpty().withMessage("Password is required"),
];
