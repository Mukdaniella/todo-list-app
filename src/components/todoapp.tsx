import React, { useState } from "react";

interface Task {
  id: number;
  text: string;
}

const TodoApp: React.FC = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // Add task
  const handleAddTask = () => {
    if (task.trim() === "") return;

    const newTask: Task = {
      id: Date.now(),
      text: task.trim(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTask("");
  };

  // Delete task
  const handleDeleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, id: number) => {
    e.dataTransfer.setData("taskId", id.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, dropId: number) => {
    const dragId = parseInt(e.dataTransfer.getData("taskId"));
    if (dragId === dropId) return;

    const dragIndex = tasks.findIndex((t) => t.id === dragId);
    const dropIndex = tasks.findIndex((t) => t.id === dropId);

    const updatedTasks = [...tasks];
    const [draggedTask] = updatedTasks.splice(dragIndex, 1);
    updatedTasks.splice(dropIndex, 0, draggedTask);

    setTasks(updatedTasks);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          📝 To-Do List App
        </h1>

        {/* Input + Add button */}
        <div className="flex mb-4 gap-3">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a new task..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleAddTask}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-2">
          {tasks.length === 0 ? (
            <li className="text-gray-500 text-center">No tasks yet</li>
          ) : (
            tasks.map((item) => (
              <li
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item.id)}
                className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 cursor-move hover:bg-gray-100 transition"
              >
                <span>{item.text}</span>
                <button
                  onClick={() => handleDeleteTask(item.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  ✕
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;
