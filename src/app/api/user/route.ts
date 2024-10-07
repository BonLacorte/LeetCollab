import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Define a schema for input validation
const userSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

// Create a new user
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, email, username, password, confirmPassword } = userSchema.parse(body);

        // console.log(name, email, username, password, confirmPassword)

        // check if email already exists
        const existingUser = await db.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 })
        }

        // check if username already exists
        const existingUsername = await db.user.findUnique({
            where: { username }
        })

        if (existingUsername) {
            return NextResponse.json({ error: "Username already exists" }, { status: 400 })
        }

        // check if password and confirmPassword match
        if (password !== confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
        }

        // create user
        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = await db.user.create({
            data: { name, email, username, password: hashedPassword }
        })
        
        const { password: newUserPassword, ...rest } = newUser;
        
        return NextResponse.json({ user: rest, message: "User created successfully" }, { status: 201 })
    } catch(error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}

// Get the user data
export const GET = async (req: Request) => {
    const session = await getServerSession(authOptions)

    return NextResponse.json({ authenticated: !!session })
}
