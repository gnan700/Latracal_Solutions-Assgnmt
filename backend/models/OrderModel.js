import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    User_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    }],
    TotalPrice: {
        type: Number,
        required: true,
        min: [0, 'Total price cannot be negative']
    },
    Status: {
        type: String,
        enum: ['Pending', 'Delivered'],
        default: 'Pending'
    }
}, { timestamps: true });

orderSchema.set("toJSON", {
    transform: (doc, { __v, createdAt, updatedAt, ...rest }) => rest,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
