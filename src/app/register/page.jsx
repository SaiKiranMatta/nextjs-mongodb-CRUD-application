"use client";

import RegistrationForm from "@/components/RegistrationForm";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
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
                    <RegistrationForm />
                    <div className="my-3">
                        Already have an account?
                        <Link href="/login" className="mx-2 underline">
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default RegisterPage;
