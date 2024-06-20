import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/mongo";
import { Post } from "@/models/postModel";

export const GET = async (request) => {
    // console.log(request);
    const id = request.url.split("?")[1].split("=")[1];
    // console.log(id);
    await dbConnect();

    try {
        const post = await Post.findById(id).populate("author", "name email");
        if (!post) {
            return new NextResponse("Post not found", {
                status: 404,
            });
        }
        return new NextResponse(JSON.stringify(post), {
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
