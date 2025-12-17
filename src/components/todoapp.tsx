import React, { useState, useEffect } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  x: number;
  y: number;
}

const TodoApp: React.FC = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Load tasks
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const findFreePosition = (startX: number, startY: number, existingTasks: Task[]) => {
    let x = startX;
    let y = startY;
    const step = 40;
    
    while (existingTasks.some(t => isOverlapping({ x, y } as Task, t))) {
      x += step;
      if (x > window.innerWidth - CARD_WIDTH - 20) {
        x = 20;
        y += step;
      }
    }
    
    return constrainToViewport(x, y);
  };

  const handleAddTask = () => {
    if (!task.trim()) return;
    const baseX = 100 + (tasks.length % 5) * 50;
    const baseY = 150 + Math.floor(tasks.length / 5) * 120;
    const position = findFreePosition(baseX, baseY, tasks);
    
    const newTask: Task = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
      ...position,
    };
    setTasks((prev) => [...prev, newTask]);
    setTask("");
  };

  const toggleCompletion = (id: number) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const handleDeleteTask = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setDraggingId(id);
    setOffset({
      x: e.clientX - task.x,
      y: e.clientY - task.y,
    });
  };

  // --- Collision detection logic ---
  const CARD_WIDTH = 230;
  const CARD_HEIGHT = 100;

  // Check if two tasks overlap
  const isOverlapping = (a: { x: number; y: number }, b: Task) => {
    return !(
      a.x + CARD_WIDTH <= b.x ||
      a.x >= b.x + CARD_WIDTH ||
      a.y + CARD_HEIGHT <= b.y ||
      a.y >= b.y + CARD_HEIGHT
    );
  };

  // Constrain position within viewport
  const constrainToViewport = (x: number, y: number) => {
    const maxX = window.innerWidth - CARD_WIDTH - 20;
    const maxY = window.innerHeight - CARD_HEIGHT - 20;
    return {
      x: Math.max(20, Math.min(x, maxX)),
      y: Math.max(150, Math.min(y, maxY))
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId === null) return;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === draggingId) {
          const desiredPos = constrainToViewport(
            e.clientX - offset.x,
            e.clientY - offset.y
          );
          const others = prev.filter(task => task.id !== t.id);
          const finalPos = findFreePosition(desiredPos.x, desiredPos.y, others);
          return { ...t, ...finalPos };
        }
        return t;
      })
    );
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-green-50 via-green-100 to-green-200 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Bar */}
      <header className="w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-green-200 p-5 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-green-900 text-center mb-2">
          📝 To Do List Workspace
        </h1>
        <p className="text-center text-green-800 text-sm">
          Add, Display, Drag, Delete, and Complete your tasks
        </p>
      </header>

      {/* Input Bar */}
      <div className="flex gap-3 justify-center mt-6">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task..."
          className="w-2/3 md:w-1/3 px-4 py-2 rounded-xl border border-green-300 focus:ring-2 focus:ring-green-500 focus:outline-none bg-white shadow-sm"
        />
        <button
          onClick={handleAddTask}
          className="bg-green-700 hover:bg-green-900 text-white px-5 py-2 rounded-xl font-semibold shadow transition"
        >
          Add
        </button>
      </div>

      {/* Floating Tasks */}
      {tasks.map((item) => (
        <div
          key={item.id}
          onMouseDown={(e) => handleMouseDown(e, item.id)}
          className={`absolute group rounded-2xl border border-green-200 bg-white/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-all cursor-grab active:cursor-grabbing ${
            draggingId === item.id ? "scale-105" : ""
          }`}
          style={{
            top: item.y,
            left: item.x,
            userSelect: "none",
            width: CARD_WIDTH,
            transition: draggingId === item.id ? "none" : "top 0.15s, left 0.15s",
          }}
        >
          <div className="p-4 flex justify-between items-start">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleCompletion(item.id)}
                className="w-5 h-5 accent-green-800 mt-1"
              />
              <span
                className={`font-medium leading-tight break-words ${
                  item.completed ? "line-through text-green-400" : "text-green-800"
                }`}
              >
                {item.text}
              </span>
            </div>

            <button
              onClick={() => handleDeleteTask(item.id)}
              className="text-gray-400 hover:text-red-500 transition text-xl font-semibold leading-none"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoApp;
