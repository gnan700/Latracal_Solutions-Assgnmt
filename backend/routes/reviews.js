import express from "express";
import { createReview, getReviewById, updateReview, deleteReview } from "../controllers/ReviewsController.js";
import authMiddleware from "../middlewares/AuthMiddleware.js"; 
import validate from "../middlewares/ValidationMiddleware.js";
import { reviewValidation } from "../validations/ReviewValidation.js"

const router = express.Router();

router.post("/", authMiddleware, reviewValidation, validate, createReview); 
router.get("/:id", getReviewById); 
router.put("/:id", authMiddleware, reviewValidation, validate, updateReview); 
router.delete("/:id", authMiddleware, deleteReview); 

export default router;
