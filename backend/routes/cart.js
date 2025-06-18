import express from "express";
import cartController from "../controllers/cart.js";
import userAuth from '../middlewares/AuthMiddleware.js';

const cartRouter = express.Router();

cartRouter.post("/", userAuth, async (req, res, next) => {
    await cartController.addToCart(req.user.id, req.body.bookId)
        .then(data => res.status(200).send({ status: "success", data }))
        .catch(error => next(error));
});

cartRouter.delete("/:id", userAuth, async (req, res, next) => {
    await cartController.removeFromCart(req.user.id, req.params.id)
        .then(data => res.status(200).send({ status: "success", data }))
        .catch(error => next(error));
});

cartRouter.get("/", userAuth, async (req, res, next) => {
    await cartController.getCart(req.user.id)
        .then(data => res.status(200).send({ status: "success", data }))
        .catch(error => next(error));
});

export default cartRouter;