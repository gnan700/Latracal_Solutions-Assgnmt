import express from 'express';
import userAuth from '../middlewares/AuthMiddleware.js';
import ordersController from '../controllers/orders.js';
import validate from '../middlewares/ValidationMiddleware.js';
import { orderValidation } from '../validations/orderValidation.js';

const ordersRouter = express.Router();

ordersRouter.post("/", userAuth, orderValidation, validate, async (req, res, next) => {
    await ordersController.create(req.body, req.user.id)
        .then(data => res.status(201).send({ status: "success", data }))
        .catch(error => next(error));
});

ordersRouter.get("/", userAuth, async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).send({ status: "error", message: "Access denied" });
    }
    const limit = req.query.limit || 5;
    const skip = ((req.query.page || 1) - 1) * limit;
    await ordersController.getMany(skip, limit)
        .then(data => res.status(200).send({ status: "success", data }))
        .catch(error => next(error));
});

ordersRouter.get("/:id", userAuth, async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).send({ status: "error", message: "Access denied" });
    }
    await ordersController.getById(req.params.id)
        .then(data => res.status(200).send({ status: "success", data }))
        .catch(error => next(error));
});

ordersRouter.delete("/:id", userAuth, async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).send({ status: "error", message: "Access denied" });
    }

    await ordersController.remove(req.params.id)
        .then(() => res.status(200).send({ status: "success", message: "Order deleted" }))
        .catch(error => next(error));
});

export default ordersRouter;