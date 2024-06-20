import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/mongo";
import { User } from "@/models/userModel";
import { Post } from "@/models/postModel";

export const POST = async (request) => {
    const { postId } = await request.json();

    if (!postId) {
        return new NextResponse("Post ID parameter missing", { status: 400 });
    } else {
        // console.log(postId);
    }

    await dbConnect();

    try {
        // Find the post to delete
        const postToDelete = await Post.findById(postId);

        if (!postToDelete) {
            return new NextResponse("Post not found", { status: 404 });
        }
        // console.log(postToDelete);
        // Delete the post from Post collection
        // console.log("1");
        // await postToDelete.remove();
        const deleteResult = await Post.deleteOne({ _id: postId });
        console.log("yes");

        // Remove the post ID from the user's blogs array
        const user = await User.findOneAndUpdate(
            { blogs: postId },
            { $pull: { blogs: postId } },
            { new: true }
        );

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Fetch updated user posts after deletion
        const userPosts = await Post.find({
            _id: { $in: user.blogs },
        }).populate("author", "name email");

        // Return updated user posts
        return new NextResponse(JSON.stringify(userPosts), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        return new NextResponse(err.message, { status: 500 });
    }
};
