"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, ArrowUpDown, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

interface Task {
  _id: string;
  title: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate?: Date;
}

export default function TaskManager() {
  const [filter, setFilter] = React.useState("");
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const router = useRouter();

  const [statusFilters, setStatusFilters] = React.useState<
    Record<string, boolean>
  >({
    "To Do": false,
    "In Progress": false,
    Completed: false,
  });
  const [priorityFilters, setPriorityFilters] = React.useState<
    Record<string, boolean>
  >({
    Low: false,
    Medium: false,
    High: false,
  });

  const filteredTasks = tasks.filter(
    (task) =>
      (task.title.toLowerCase().includes(filter.toLowerCase()) ||
        task._id.toLowerCase().includes(filter.toLowerCase())) &&
      (Object.values(statusFilters).every((v) => v === false) ||
        statusFilters[task.status]) &&
      (Object.values(priorityFilters).every((v) => v === false) ||
        priorityFilters[task.priority])
  );

  const handleStatusFilterChange = (status: string) => {
    setStatusFilters((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const handlePriorityFilterChange = (priority: string) => {
    setPriorityFilters((prev) => ({ ...prev, [priority]: !prev[priority] }));
  };

  const clearFilters = () => {
    setStatusFilters({
      "To Do": false,
      "In Progress": false,
      Completed: false,
    });
    setPriorityFilters({
      Low: false,
      Medium: false,
      High: false,
    });
  };

  const handlecreateTask = () => {
    router.push("/task/createtask");
  };

  const handleEdit = (taskId: string) => {
    router.push(`/task/edittask?taskId=${taskId}`);
  };

  const handleDelete = async (taskId: string) => {
    try {
      await axios.delete(`/api/task/delete/${taskId}`, {
        withCredentials: true,
      });
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Failed to delete task", error);
    }
  };

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/task/get", {
          withCredentials: true,
        });
        setTasks(response.data);
      } catch (error) {
        toast.error("Failed to fetch tasks");
        console.error("Failed to fetch tasks", error);
      }
    };

    fetchTasks();
  }, []);

  const statusCounts = tasks.reduce((acc, task) => {
    acc[task?.status] = (acc[task?.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityCounts = tasks.reduce((acc, task) => {
    acc[task?.priority] = (acc[task?.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
      <p className="text-gray-600 mb-4">A list of your tasks</p>
      <div className="flex flex-col space-y-2 mb-4">
        <Input
          type="text"
          placeholder="Filter tasks..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full"
        />
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {Object.entries(statusFilters).map(([status, isChecked]) => (
                <DropdownMenuItem
                  key={status}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleStatusFilterChange(status)}
                  />
                  <span>{status}</span>
                  <span className="ml-auto text-gray-500">
                    {statusCounts[status] || 0}
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => clearFilters()}>
                Clear filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Priority
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {Object.entries(priorityFilters).map(([priority, isChecked]) => (
                <DropdownMenuItem
                  key={priority}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handlePriorityFilterChange(priority)}
                  />
                  <span>{priority}</span>
                  <span className="ml-auto text-gray-500">
                    {priorityCounts[priority] || 0}
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => clearFilters()}>
                Clear filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => handlecreateTask()}
            className="w-full sm:w-2/12"
          >
            Create Task
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] hidden sm:table-cell">
                Task ID
              </TableHead>
              <TableHead>Task</TableHead>
              <TableHead className="w-[100px] hidden sm:table-cell">
                Status
              </TableHead>
              <TableHead className="w-[100px] hidden sm:table-cell">
                Priority
              </TableHead>
              <TableHead className="w-[120px] hidden sm:table-cell">
                Due Date
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell
                  className="font-medium hidden sm:table-cell"
                  onClick={() => router.push(`/task/${task?._id}`)}
                >
                  {task?._id}
                </TableCell>
                <TableCell onClick={() => router.push(`/task/${task?._id}`)}>
                  <div className="flex items-center justify-between">
                    <span className="truncate mr-2">{task?.title}</span>
                    <span className="sm:hidden">...</span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {task?.status}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {task?.priority}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {task?.dueDate
                    ? new Date(task?.dueDate).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(task?._id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(task?._id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
