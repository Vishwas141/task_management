import {  NextResponse } from "next/server";
import Task from "@/models/task";
import Connection from "@/database/config";
import jwt from "jsonwebtoken";

Connection();

export const GET = async (req) => {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized token not found" }, { status: 401 });
    }
 
    const user = jwt.verify(token, process.env.JWT_SECRET);
   

      const userId = user.id;
 
    
    const tasks = await Task.find({ user: userId });

    return NextResponse.json(tasks, { status: 200 });

  } catch (error) {
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
};

