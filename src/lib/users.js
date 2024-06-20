import { User } from "@/models/userModel";

export async function createUser(user) {
    try {
        await User.create(user);
    } catch (e) {
        throw new Error(e);
    }
}
