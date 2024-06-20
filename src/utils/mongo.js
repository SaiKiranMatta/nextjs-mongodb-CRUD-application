//Util to connect to mongoDB
import mongoose from "mongoose";

export async function dbConnect() {
    try {
        let conn = await mongoose
            .connect(String(process.env.NEXT_PUBLIC_MONGODB_URI))
            .then(console.log("Connected to db"));
        return conn;
    } catch (e) {
        throw new Error(e);
    }
}
