"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    useEffect(() => {
        if (status === "authenticated") {
            redirect("/");
            // User is already authenticated, redirect to homepage
        } else if (status === "loading") {
            // Session is still loading, do nothing (optional)
        } else {
            setLoading(false);
            // User is not authenticated, continue rendering the component
        }
    }, [status, redirect]);
    return (
        <>
            {!loading && (
                <div className="flex flex-col items-center justify-center pt-24">
                    <LoginForm />
                    <div className="my-3">
                        Don't have an account?
                        <Link href="/register" className="mx-2 underline">
                            Register
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginPage;
