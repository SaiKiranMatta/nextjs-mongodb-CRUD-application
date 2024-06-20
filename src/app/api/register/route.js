import { NextResponse } from "next/server";
import { createUser } from "@/lib/users";

import bcrypt from "bcryptjs";
import { dbConnect } from "@/utils/mongo";

export const POST = async (request) => {
    const { name, email, password } = await request.json();

    console.log(name, email, password);

    await dbConnect();

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = {
        name,
        password: hashedPassword,
        email,
    };

    try {
        await createUser(newUser).then(console.log("User created"));
    } catch (err) {
        return new NextResponse(error.mesage, {
            status: 500,
        });
    }

    return new NextResponse("New user has been created", {
        status: 201,
    });
};
