// /app/api/task/update/[taskId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/task"; // Adjust the path as necessary
import Connection from "@/database/config"; // Adjust the path as necessary

Connection();

export const PUT = async (req: NextRequest, { params }: { params: { taskId: string } }) => {
  const { taskId } = params;
  console.log("Updating task with ID:", taskId);

  try {
    const updatedData = await req.json(); 

  
    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, {
      new: true,
      runValidators: true, 
    });

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error); // Log the error for debugging
    return NextResponse.json(
      { message: "Server error"},
      { status: 500 }
    );
  }
};
