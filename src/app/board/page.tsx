"use client";
import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
}

const columns: { id: Task["status"]; title: string }[] = [
  { id: "To Do", title: "To Do" },
  { id: "In Progress", title: "In Progress" },
  { id: "Completed", title: "Completed" },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/task/get");
      setTasks(response.data);
    } catch (error) {
      toast.error("Error fetching tasks");
      console.error("Error fetching tasks:", error);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as Task["status"];
    const updatedTasks = Array.from(tasks);
    const taskIndex = updatedTasks.findIndex(
      (task) => task?._id === draggableId
    );
    const [movedTask] = updatedTasks.splice(taskIndex, 1);
    movedTask.status = newStatus;

    const destinationTasks = updatedTasks.filter(
      (task) => task.status === newStatus
    );
    destinationTasks.splice(destination.index, 0, movedTask);

    const finalTasks = [
      ...updatedTasks.filter((task) => task.status !== newStatus),
      ...destinationTasks,
    ];

    setTasks(finalTasks);

    try {
      await axios.put(`/api/task/updateStatus/${draggableId}`, {
        status: newStatus,
      });
      toast.success(`Task moved to ${newStatus}`);
    } catch (error) {
      toast.error("Error updating task status");
      console.error("Error updating task status:", error);
      fetchTasks(); 
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((column) => (
            <div
              key={column.id}
              className="bg-gray-100 p-4 rounded-lg flex flex-col"
            >
              <h2 className="text-lg font-semibold mb-2">{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-grow overflow-y-auto ${
                      snapshot.isDraggingOver ? "bg-gray-200" : ""
                    }`}
                    style={{ minHeight: "400px" }} // Ensure minimum height
                  >
                    {tasks
                      .filter((task) => task?.status === column.id)
                      .map((task, index) => (
                        <Draggable
                          key={task?._id}
                          draggableId={task?._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-2 ${
                                snapshot.isDragging ? "opacity-50" : ""
                              }`}
                            >
                              <Card
                                onClick={() => router.push(`/task/${task?._id}`)}
                              >
                                <CardHeader>
                                  <CardTitle className="text-sm font-medium">
                                    {task?.title}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-xs text-gray-600 mb-2">
                                    {task?.description}
                                  </p>
                                  <Badge
                                    className={`${getPriorityColor(
                                      task?.priority
                                    )}`}
                                  >
                                    {task?.priority}
                                  </Badge>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
