import User from "../models/UserModel.js";
import Book from "../models/BookModel.js";

const addToCart = async (userId, bookId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const book = await Book.findById(bookId);
    if (!book) throw new Error("Book not found");

    user.Cart.push(bookId);
    await user.save();

    return await user.populate("Cart");
};

const removeFromCart = async (userId, bookId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.Cart = user.Cart.filter(id => id.toString() !== bookId);
    await user.save();

    return await user.populate("Cart");
};

const getCart = async (userId) => {
    const user = await User.findById(userId).populate("Cart");
    if (!user) throw new Error("User not found");

    return user.Cart;
};

export default { addToCart, removeFromCart, getCart };
