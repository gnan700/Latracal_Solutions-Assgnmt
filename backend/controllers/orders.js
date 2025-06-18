import mongoose from "mongoose";
import Order from "../models/OrderModel.js";
import Book from "../models/BookModel.js";
import User from "../models/UserModel.js";
import sendEmail from "../services/mail.js";

const create = async (orderData, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { Books, TotalPrice } = orderData;

        if (!Books || Books.length === 0 || TotalPrice < 0) {
            throw new Error("Invalid order data");
        }

        const validBooks = await Book.find({ _id: { $in: Books } }).session(session);
        if (validBooks.length !== Books.length) {
            throw new Error("One or more books not found");
        }

        for (const book of validBooks) {
            if (book.Stock <= 0) {
                throw new Error(`Book ${book.Title} is out of stock`);
            }
            book.Stock -= 1;
            await book.save({ session });
        }

        const order = await Order.create([{ User_ID: userId, Books: Books, TotalPrice: TotalPrice }], { session });

        await session.commitTransaction();

        const { Name, Email } = await User.findById(userId);
        sendEmail(Email, 'Order Confirmation', `Dear ${Name},\nThank you for your order!\nWe will notify you once your order is shipped.\n\nBest regards,\nOnline Bookstore`);

        return order[0];
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const getMany = (skip, limit) => {
    return Order.find().populate("User_ID", "Name Email").populate("Books").skip(skip).limit(limit);
};

const getById = (orderId) => {
    return Order.findById(orderId).populate("User_ID", "Name Email").populate("Books");
};

const remove = (orderId) => {
    return Order.findByIdAndDelete(orderId);
};

export default { create, getMany, getById, remove };
