import React, { useState } from "react";

interface Task {
  id: number;
  text: string;
}

const TodoApp: React.FC = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // Handle adding a task
  const handleAddTask = () => {
    if (task.trim() === "") return; // Prevent blank input

    const newTask: Task = {
      id: Date.now(),
      text: task.trim(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTask(""); // clear input
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          📝 To-Do List
        </h1>

        {/* Input + Add button */}
        <div className="flex mb-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a new task..."
            className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition"
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
                className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
              >
                <span>{item.text}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;
