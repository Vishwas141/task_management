import { NextResponse } from "next/server";


export const POST = async () => {
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
