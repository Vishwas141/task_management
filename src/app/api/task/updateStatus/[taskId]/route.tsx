import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/task";
import Connection from "@/database/config";

Connection();

export const PUT = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const taskId = url.pathname.split("/").pop(); // Extract the taskId from the URL

    const { status } = await req.json();

    console.log("Task ID:", taskId);
    console.log("Status to update:", status);

    if (!taskId) {
      return NextResponse.json(
        { message: "Task ID is required" },
        { status: 400 }
      );
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      { status: status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error("Error updating task status:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
};
