"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, ClockIcon, ListIcon } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TaskDetail() {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;
  
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/api/task/get`, {
          params: { id: taskId },
        });

        setTask(response.data[0]);
      } catch (error) {
        toast.error("Failed to fetch task details");
        console.error("Failed to fetch task details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleEdit = () => {
    router.push(`/task/edittask?taskId=${taskId}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/task/delete/${taskId}`, {
        withCredentials: true,
      });
      toast.success("Task deleted successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Failed to delete task", error);
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "To Do":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Task not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested task could not be found.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard")}>Back to Task List</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{task.title}</CardTitle>
              <CardDescription>Task ID: {task._id}</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Badge className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{task.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <CalendarIcon className="mr-2" />
              <span>
                Due Date:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "Not set"}
              </span>
            </div>
           
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ListIcon className="mr-2 h-4 w-4" /> Back to Task List
          </Button>
          <div className="space-x-2">
            <Button variant="secondary" onClick={handleEdit}>
              Edit Task
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Task
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
