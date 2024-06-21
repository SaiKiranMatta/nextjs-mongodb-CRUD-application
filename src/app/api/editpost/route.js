import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/mongo";
import { User } from "@/models/userModel";
import { Post } from "@/models/postModel";

export const PUT = async (request) => {
    const { id, title, content, authorEId, category } = await request.json();

    await dbConnect();

    try {
        // Find the post by ID
        const post = await Post.findById(id);

        if (!post) {
            return new NextResponse("Post not found", {
                status: 404,
            });
        }

        // Find the user by email
        const user = await User.findOne({ email: authorEId });

        if (!user) {
            return new NextResponse("User not found", {
                status: 404,
            });
        }

        // Check if the user is the author of the post
        if (post.author.toString() !== user._id.toString()) {
            return new NextResponse("Not authorized", {
                status: 403,
            });
        }

        // Update post details
        post.title = title;
        post.content = content;
        post.category = category;
        // post.updatedAt = new Date();

        await post.save();

        return new NextResponse("Post has been updated", {
            status: 200,
        });
    } catch (err) {
        return new NextResponse(err.message, {
            status: 500,
        });
    }
};
