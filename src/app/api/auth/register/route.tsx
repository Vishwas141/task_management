import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import bcryptjs from "bcryptjs";
import Connection from "@/database/config"

Connection();

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();


        const { username, email, password } = body;

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "Please fill all fields" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcryptjs.hash(password, 10);


        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return NextResponse.json({ message: "User registered successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
