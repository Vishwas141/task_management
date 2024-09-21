// /app/api/task/delete/[taskId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/task"; // Adjust the path as necessary
import User from "@/models/user"; // Import the User model
import Connection from "@/database/config"; // Adjust the path as necessary
import jwt from "jsonwebtoken"; // Ensure you have this library

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
    console.log(token);

    const user = jwt.verify(token, "mysecretkey");
    userId = user.id;
    console.log(userId);
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    const task = await Task.findById(taskId);
    console.log(task);

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
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
};
