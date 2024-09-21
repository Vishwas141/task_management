import { NextRequest, NextResponse } from "next/server";
import Connection from "@/database/config";

Connection();

export const POST = async (req: NextRequest) => {
  try {
    const res = NextResponse.next();

    

    res.cookies.set("token", "", {
      maxAge: -1,
      path: "/", 
    });

   

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
