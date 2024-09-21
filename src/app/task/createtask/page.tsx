import TaskCreationForm from "./taskcreationform";

export default function TaskManagerPage() {
  
  return (
    <div className="container mx-auto p-4 flex flex-col justify-center items-center  ">
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
      <div className="max-w-md mx-auto">
        <TaskCreationForm />
      </div>
    </div>
  );
}
