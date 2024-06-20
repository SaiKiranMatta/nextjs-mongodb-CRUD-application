"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("/api/fetchallblogs", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                setPosts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="flex flex-col items-center w-full px-8 pt-24">
            <h1 className="text-4xl">All Blog Posts</h1>
            {posts.length > 0 ? (
                <ul className="w-full mt-8">
                    {posts.map((post) => (
                        <li
                            key={post._id}
                            onClick={() => router.push(`/blogs/${post._id}`)}
                            className="p-4 mb-4 border rounded-md shadow-md cursor-pointer dark:bg-zinc-800 bg-slate-100"
                        >
                            <h2 className="text-2xl duration-300 hover:text-blue-500">
                                {post.title}
                            </h2>
                            {/* <p>{post.content}</p> */}
                            <p className="text-sm">
                                Author: {post.author.name} ({post.author.email})
                            </p>
                            <p className="text-sm">Category: {post.category}</p>
                            <p className="text-sm">
                                Created At:{" "}
                                {new Date(post.createdAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts found.</p>
            )}
        </div>
    );
};

export default PostsPage;
