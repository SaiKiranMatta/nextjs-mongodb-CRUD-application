"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BlogPostPage = ({ params }) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(
                    `/api/fetchblog/?id=${params.blogid}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                setPost(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPost();
    }, [params.blogid]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!post) {
        return <p>Post not found</p>;
    }

    return (
        <div className="flex flex-col items-start w-full px-8 pt-24 ">
            <h1 className="text-4xl">{post.title}</h1>
            <div className="w-full h-[0.1px] my-4 bg-zinc-600"></div>
            <p className="mt-4">{post.content}</p>
            <div className="w-full h-[0.1px] my-4 bg-zinc-600"></div>

            <p className="mt-2 text-sm">
                Author: {post.author.name} ({post.author.email})
            </p>
            <div className="w-full h-[0.1px] my-4 bg-zinc-600"></div>

            <p className="mt-2 text-sm">Category: {post.category}</p>
            <div className="w-full h-[0.1px] my-4 bg-zinc-600"></div>

            <p className="mt-2 text-sm">
                Created At: {new Date(post.createdAt).toLocaleString()}
            </p>
        </div>
    );
};

export default BlogPostPage;
