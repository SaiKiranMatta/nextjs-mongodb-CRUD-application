"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
                    const response = await fetch("/api/fetchuserposts", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email: session.user.email }),
                    });

                    if (!response.ok) {
                        throw new Error(`Error: ${response.statusText}`);
                    }

                    const data = await response.json();
                    setUserPosts(data);
                    setLoading(false);
                }
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [session, status]);

    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch("/api/deletepost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            // Remove the deleted post from userPosts state
            setUserPosts(userPosts.filter((post) => post._id !== postId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <p className="pt-24">Loading...</p>;
    }

    if (error) {
        return <p className="pt-24">{error}</p>;
    }

    if (userPosts.length === 0) {
        return <p className="pt-24">No posts found for the logged-in user</p>;
    }

    return (
        <div className="flex flex-col items-center w-full px-8 pt-24">
            <h1 className="text-4xl">Authored Blog Posts</h1>
            {userPosts.length > 0 ? (
                <ul className="w-full mt-8">
                    {userPosts.map((post) => (
                        <li
                            key={post._id}
                            className="p-4 mb-4 border rounded-md shadow-md cursor-pointer dark:bg-zinc-800 bg-slate-100"
                        >
                            <h2
                                onClick={() =>
                                    router.push(`/blogs/${post._id}`)
                                }
                                className="text-2xl duration-300 cursor-pointer hover:text-blue-500"
                            >
                                {post.title}
                            </h2>
                            <p className="text-sm">
                                Author: {post.author.name} ({post.author.email})
                            </p>
                            <p className="text-sm">Category: {post.category}</p>
                            <p className="text-sm">
                                Created At:{" "}
                                {new Date(post.createdAt).toLocaleString()}
                            </p>
                            {/* <button
                                onClick={() => handleDeletePost(post._id)}
                                className="px-4 py-2 mt-2 text-white bg-red-500 rounded hover:bg-red-600"
                            >
                                Delete
                            </button> */}
                            <div className="flex items-center justify-between w-full ">
                                <AlertDialog>
                                    <AlertDialogTrigger className="w-20 px-4 py-2 mt-2 text-center text-white bg-red-500 rounded hover:bg-red-600">
                                        Delete
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                                This will permanently the blog
                                                and remove the data from our
                                                servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction>
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <div
                                    className="w-20 px-4 py-2 font-light text-center text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-400"
                                    onClick={() =>
                                        router.push(`/edit/${post._id}`)
                                    }
                                >
                                    Edit
                                </div>
                            </div>
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
