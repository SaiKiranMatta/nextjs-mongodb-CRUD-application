"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const BlogPostCreationForm = () => {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const [authorEId, setAuthorEId] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (status === "authenticated") {
            // User is already authenticated, redirect to homepage
            setLoading(false);
            setAuthorEId(session.user.email);
        } else if (status === "loading") {
            // Session is still loading, do nothing (optional)
        } else {
            redirect("/");
            // User is not authenticated, continue rendering the component
        }
    }, [status, redirect, setAuthorEId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            title,
            content,
            authorEId,
            category,
        };

        try {
            const response = await fetch("/api/createblog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            setMessage("Blog post created successfully!");
            setTitle("");
            setContent("");
            setAuthorId("");
            setCategory("");
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center w-full px-8 pt-24">
            <h1 className="text-4xl">Create a New Blog Post</h1>
            <form
                className="flex flex-col items-start w-full h-screen px-4 py-4 mt-8 rounded-md shadow-md dark:bg-zinc-800 bg-slate-100 "
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col w-full ">
                    <label className="mb-2 text-2xl ">Title:</label>
                    <Input
                        type="text"
                        className="w-full border border-zinc-600 "
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col w-full mt-4 h-[75%] ">
                    <label className="mb-2 text-2xl ">Content:</label>
                    <Textarea
                        className="w-full h-full border border-zinc-600 "
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                {/* <div>
                    <label>Author ID:</label>
                    <input
                        type="text"
                        value={authorId}
                        onChange={(e) => setAuthorId(e.target.value)}
                        required
                    />
                </div> */}
                <div className="flex flex-col w-full mt-4 ">
                    <label className="mb-2 text-2xl ">Category:</label>
                    <Input
                        type="text"
                        className="w-full border border-zinc-600 "
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <button
                    className=" mt-8 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                >
                    Create Post
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default BlogPostCreationForm;
