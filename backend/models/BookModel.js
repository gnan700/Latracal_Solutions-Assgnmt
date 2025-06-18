import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    Authors_IDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    }],
    Desc: {
        type: String,
        trim: true
    },
    Stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    Image: {
        type: String,
        match: [/\.(jpg|jpeg|png|gif)$/, 'Invalid image format']
    },
    Price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    }
}, { timestamps: true });

bookSchema.set("toJSON", {
    transform: (doc, { __v, createdAt, updatedAt, ...rest }) => rest,
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
