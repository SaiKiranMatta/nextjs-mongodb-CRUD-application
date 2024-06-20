"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const BlogPostPage = () => {
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                if (status === "authenticated" && session?.user?.email) {
                    const response = await fetch(
                        "/api/fetchuserposts", // Endpoint for fetching user posts
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ email: session.user.email }), // Send email in the request body
                        }
                    );

                    if (!response.ok) {
                        throw new Error(`Error: ${response.statusText}`);
                    } else {
                        const data = await response.json();
                        // console.log(data);
                        setUserPosts(data);
                        setLoading(false);
                        console.log("Response is ok");
                    }
                }
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [session, status]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (userPosts.length === 0) {
        return <p>No posts found for the logged-in user</p>;
    }

    return (
        // <div>
        //     {userPosts.map((post) => (
        //         <div
        //             key={post._id}
        //             className="flex flex-col items-start w-full px-8 pt-24"
        //         >
        //             <h1 className="text-4xl">{post.title}</h1>
        //             <div className="w-full h-[0.1px] my-4 bg-zinc-600"></div>
        //             <p className="mt-4">{post.content}</p>
        //             <div className="w-full h-[0.1px] my-4 bg-zinc-600"></div>

        //             <p className="mt-2 text-sm">
        //                 Author: {post.author.name} ({post.author.email})
        //             </p>
        //             <div className="w-full h-[0.1px] my-4 bg-zinc-600"></div>

        //             <p className="mt-2 text-sm">Category: {post.category}</p>
        //             <div className="w-full h-[0.1px] my-4 bg-zinc-600"></div>

        //             <p className="mt-2 text-sm">
        //                 Created At: {new Date(post.createdAt).toLocaleString()}
        //             </p>
        //         </div>
        //     ))}
        // </div>
        <div className="flex flex-col items-center w-full px-8 pt-24">
            <h1 className="text-4xl">Authored Blog Posts</h1>
            {userPosts.length > 0 ? (
                <ul className="w-full mt-8">
                    {userPosts.map((post) => (
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

export default BlogPostPage;
