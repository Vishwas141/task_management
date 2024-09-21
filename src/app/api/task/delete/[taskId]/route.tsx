

import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/task"; 
import User from "@/models/user";
import Connection from "@/database/config"; 
import jwt from "jsonwebtoken";

Connection();

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { taskId: string } }
) => {
  const { taskId } = params;
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: Token not found" },
      { status: 401 }
    );
  }

  let userId;
  try {
   

    const user = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
     userId = user.id as string;
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" ,error}, { status: 401 });
  }

  try {
    const task = await Task.findById(taskId);
   

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    console.log(task.user.toString());
    if (task.user.toString() !== userId) {
      return NextResponse.json(
        { message: "Unauthorized: You do not own this task" },
        { status: 403 }
      );
    }

    await Task.findByIdAndDelete(taskId);

    await User.findByIdAndUpdate(userId, { $pull: { tasks: taskId } });

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
};
