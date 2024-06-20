import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/mongo";
import { Post } from "@/models/postModel";

export const GET = async (request) => {
    await dbConnect();

    try {
        const posts = await Post.find().populate("author", "name email");
        return new NextResponse(JSON.stringify(posts), {
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
