"use client";

import * as React from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Calendar from "react-calendar"; 
import "react-calendar/dist/Calendar.css"; 
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


interface FormData {
  title: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
    dueDate?: Date;
    description: string;
}

export default function TaskCreationForm() {
  const [formData, setFormData] = React.useState<FormData>({
    title: "",
    status: "To Do",
    priority: "Medium",
    description: "",
  });

  const [errors, setErrors] = React.useState<Partial<FormData>>({});
  const [calendarOpen, setCalendarOpen] = React.useState(false); // State to control the calendar visibility
  const router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date ) => {
    setFormData({ ...formData, dueDate: date });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (formData.title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters.";
      toast.error("Title must be at least 2 characters.");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try
      {
            await axios.post(
             "/api/task/create", 
             {
               title: formData.title,
               description: formData.description,
               dueDate: formData.dueDate,
               status: formData.status,
               priority: formData.priority,
             }, {
                withCredentials: true
             }
        );
        setFormData({
          title: "",
          status: "To Do",
          priority: "Medium",
          dueDate: undefined,
          description: "",
        });
        router.push("/dashboard");

      }
      catch (error)
      {
        toast.error("Failed to create task");
        console.error(error);
      }      
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full  mt-5 sm:w-[550px] sm:h-[70vh] sm:mt-2  "
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Task Title
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter task title"
          className="mt-1"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Task Title
        </label>
        <Input
          id="description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter task description"
          className="mt-1"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <Select
            onValueChange={(value) => handleSelectChange("status", value)}
            defaultValue={formData?.status}
          >
            <SelectTrigger id="status" className="mt-1">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700"
          >
            Priority
          </label>
          <Select
            onValueChange={(value) => handleSelectChange("priority", value)}
            defaultValue={formData.priority}
          >
            <SelectTrigger id="priority" className="mt-1">
              <SelectValue placeholder="Select a priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700"
        >
          Due Date
        </label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              onClick={() => setCalendarOpen(!calendarOpen)}
              className={cn(
                "w-full mt-1 justify-start text-left font-normal",
                !formData?.dueDate && "text-muted-foreground"
              )}
            >
              {formData?.dueDate ? (
                format(formData?.dueDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          {calendarOpen && (
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                onChange={(value) => value && handleDateChange(value as Date)}
                value={formData?.dueDate || new Date()}
                minDate={new Date()}
              />
            </PopoverContent>
          )}
        </Popover>
      </div>

      <Button type="submit" className="w-full">
        Create Task
      </Button>
    </form>
  );
}
