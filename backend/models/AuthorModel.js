import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    Email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email must be a valid email address']
    }
}, { timestamps: true });

authorSchema.set("toJSON", {
    transform: (doc, { __v, createdAt, updatedAt, ...rest }) => rest,
});

const Author = mongoose.model('Author', authorSchema);
export default Author;
