import { NextRequest, NextResponse } from "next/server";
import Connection from "@/database/config";

Connection();

export const POST = async (req: NextRequest) => {
  try {
    const res = NextResponse.next();

    console.log("Before clearing:", req.cookies); // Log current cookies

    res.cookies.set("token", "", {
      maxAge: -1,
      path: "/", // Make sure this matches the original path
    });

    console.log("After clearing:", res.cookies); // Log updated cookies

    return NextResponse.json(
      { message: "User logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
