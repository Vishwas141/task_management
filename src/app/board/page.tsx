"use client";

import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import toast from "react-hot-toast";

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
    const updatedTasks = tasks.map((task) =>
      task._id === draggableId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);

    try {
      let taskId = draggableId;
      await axios.put(`/api/task/updateStatus/${taskId}`, {
        status: newStatus,
      });
      toast.success(`Task ${draggableId} moved to ${newStatus}`);
  
    } catch (error) {
      toast.error("Error updating task status");
      setTasks(tasks);
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
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.id
            );
            const columnHeight = `${Math.max(400, columnTasks.length * 100)}px`;

            return (
              <div
                key={column.id}
                className="bg-gray-100 p-4 rounded-lg flex flex-col"
              >
                <h2 className="text-lg font-semibold mb-2">{column.title}</h2>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <ScrollArea
                      className={`flex-grow overflow-y-auto`}
                      style={{ height: columnHeight }}
                    >
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2 min-h-full"
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-2"
                              >
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-sm font-medium">
                                      {task.title}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-xs text-gray-600 mb-2">
                                      {task.description}
                                    </p>
                                    <Badge
                                      className={`${getPriorityColor(
                                        task.priority
                                      )}`}
                                    >
                                      {task.priority}
                                    </Badge>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </ScrollArea>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
