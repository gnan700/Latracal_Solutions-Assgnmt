import { body } from "express-validator";

export const orderValidation = [
  body("User_ID")
    .trim()
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID"),

  body("Books")
    .isArray({ min: 1 })
    .withMessage("At least one book must be ordered"),

  body("TotalPrice")
    .isFloat({ min: 0 })
    .withMessage("Total price cannot be negative"),

  body("Status")
    .optional()
    .isIn(["Pending", "Delivered"])
    .withMessage("Status must be 'Pending' or 'Delivered'"),
];
