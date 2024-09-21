import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/task";
import User from "@/models/user";
import Connection from "@/database/config";
import jwt from "jsonwebtoken";

Connection();

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { title, description, dueDate, status, priority } = body;
    
    if (!title || !description) {
      return NextResponse.json(
        { message: "Please fill all fields" },
        { status: 400 }
      );
    }

    const token = req.cookies.get('token')?.value;

    console.log(token);

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized, no token" },
        { status: 401 }
      );
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;


    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }


    const task = new Task({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      status: status || "To Do",
      priority: priority || "Medium",
      user: user._id,
    });


    await task.save();

    user.tasks.push(task._id);
    await user.save();

    return NextResponse.json(
      { message: "Task created successfully", task },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

