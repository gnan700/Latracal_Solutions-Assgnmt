import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    BookID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    Rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    Review: {
        type: String,
        trim: true,
        maxlength: [500, 'Review cannot exceed 500 characters']
    }
}, { timestamps: true });

reviewSchema.set("toJSON", {
    transform: (doc, { __v, ...rest }) => rest
});


const Review = mongoose.model('Review', reviewSchema);
export default Review;
