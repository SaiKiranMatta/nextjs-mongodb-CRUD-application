import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/mongo";
import { User } from "@/models/userModel";
import { Post } from "@/models/postModel";

export const POST = async (request) => {
    const { email } = await request.json();

    if (!email) {
        return new NextResponse("Email parameter missing", { status: 400 });
    } else {
        // console.log(email);
    }

    await dbConnect();

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }
        {
            // console.log(user);
        }

        // Fetch posts authored by the user
        const userPosts = await Post.find({
            _id: { $in: user.blogs },
        }).populate("author", "name email");

        // console.log(userPosts);

        return new NextResponse(JSON.stringify(userPosts), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        return new NextResponse(err.message, {
            status: 500,
        });
    }
};
