import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/mongo";
import { User } from "@/models/userModel";
import { Post } from "@/models/postModel";

export const POST = async (request) => {
    const { title, content, authorEId, category } = await request.json();

    await dbConnect();

    try {
        console.log(authorEId);
        // Find the user by email
        const user = await User.findOne({ email: authorEId });

        if (!user) {
            return new NextResponse("User not found", {
                status: 404,
            });
        }

        // Create new post
        const newPost = {
            title,
            content,
            author: user._id,
            category,
            createdAt: new Date(),
        };

        const post = await Post.create(newPost);

        // Update user's blogs array
        user.blogs.push(post._id);
        await user.save();

        return new NextResponse("New blog post has been created", {
            status: 201,
        });
    } catch (err) {
        return new NextResponse(err.message, {
            status: 500,
        });
    }
};
