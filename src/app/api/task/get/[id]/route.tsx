import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/task";
import Connection from "@/database/config";

Connection();

export const GET = async (req: NextRequest) => {
  try {
   
    const { searchParams } = new URL(req.url);
      const taskId = searchParams.get("id"); 
  
    if (!taskId) {
      return NextResponse.json(
        { message: "Task ID is required" },
        { status: 400 }
      );
      }
      
    const task = await Task.findById(taskId);

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    
      
      return NextResponse.json({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          status: task.status,
            priority: task.priority,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error",error }, { status: 500 });
  }
};
