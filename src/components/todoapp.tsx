import React, { useState, useEffect } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  category: "Today" | "Tomorrow";
}

const TodoApp: React.FC = () => {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState<"Today" | "Tomorrow">("Today");
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!task.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
      category,
    };
    setTasks((prev) => [...prev, newTask]);
    setTask("");
  };

  const handleDeleteTask = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const toggleCompletion = (id: number) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, id: number) =>
    e.dataTransfer.setData("taskId", id.toString());

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, dropId: number) => {
    const dragId = parseInt(e.dataTransfer.getData("taskId"));
    if (dragId === dropId) return;
    const dragIndex = tasks.findIndex((t) => t.id === dragId);
    const dropIndex = tasks.findIndex((t) => t.id === dropId);
    const updated = [...tasks];
    const [dragged] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, dragged);
    setTasks(updated);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) =>
    e.preventDefault();

  const tasksByCategory = (cat: "Today" | "Tomorrow") =>
    tasks.filter((t) => t.category === cat);

  const categoryColors: Record<"Today" | "Tomorrow", string> = {
    Today: "bg-green-300 border-green-300",
    Tomorrow: "bg-green-200 border-green-300",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl p-6 rounded-3xl shadow-xl bg-white">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">
             📝 To-Do List Board
        </h1>

        {/* Input */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none shadow-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as "Today" | "Tomorrow")}
            className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none shadow-sm"
          >
            <option className="bg-pink-400 hover:bg-pink-500" value="Today">Today</option>
            <option className="bg-pink-400 hover:bg-pink-500" value="Tomorrow">Tomorrow</option>
          </select>
          <button
            onClick={handleAddTask}
            className="bg-pink-400 hover:bg-pink-500 px-5 py-2 rounded-xl font-semibold text-white shadow transition"
          >
            Add
          </button>
        </div>

        {/* Task Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(["Today", "Tomorrow"] as const).map((cat) => (
            <div key={cat}>
              <h2 className="text-xl font-semibold mb-3">{cat}</h2>
              <ul className="space-y-4">
                {tasksByCategory(cat).length === 0 ? (
                  <li className="text-gray-400 italic text-center">No tasks</li>
                ) : (
                  tasksByCategory(cat).map((item) => (
                    <li
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, item.id)}
                      className={`flex justify-between items-center p-4 rounded-2xl border ${categoryColors[cat]} shadow-md hover:scale-[1.03] transition cursor-move`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleCompletion(item.id)}
                          className="w-5 h-5 accent-pink-400"
                        />
                        <span
                          className={`font-medium ${
                            item.completed ? "line-through text-gray-500" : "text-gray-800"
                          }`}
                        >
                          {item.text}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(item.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-lg transition"
                      >
                        delete
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
