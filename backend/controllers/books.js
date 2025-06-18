import Book from '../models/BookModel.js';
import { getBookReviews } from './ReviewsController.js';

const create = (bookData) => {
    return Book.insertOne(bookData);
}

const getMany = (filter, skip, limit) => {
    return Book.find(filter).skip(skip).limit(limit);
}

const getById = (bookId) => {
    return Book.findById(bookId);
}

const getReviews = (bookId) => {
    return getBookReviews(bookId);
}

const update = (bookId, newData) => {
    return Book.findByIdAndUpdate(bookId, newData);
}

const remove = (bookId) => {
    return Book.findByIdAndDelete(bookId);
}

export default { create, getMany, getById, getReviews, update, remove };