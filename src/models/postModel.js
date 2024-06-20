import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    title: {
        required: true,
        type: String,
    },
    content: {
        required: true,
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Post = mongoose.models.Post ?? mongoose.model("Post", postSchema);
