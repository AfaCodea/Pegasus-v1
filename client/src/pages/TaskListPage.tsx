import { FormEvent, useEffect, useState } from 'react';
import { api, Task } from '../api/client';

export function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    api.listTasks().then(setTasks).catch(console.error);
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const task = await api.createTask(title);
    setTasks((prev) => [task, ...prev]);
    setTitle('');
  }

  async function toggleStatus(task: Task) {
    const next = task.status === 'done' ? 'todo' : 'done';
    const updated = await api.updateTask(task.id, { status: next });
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
  }

  async function handleDelete(id: number) {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div>
      <h1>Tasks</h1>
      <form onSubmit={handleAdd}>
        <input
          placeholder="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              style={{ textDecoration: task.status === 'done' ? 'line-through' : 'none' }}
              onClick={() => toggleStatus(task)}
            >
              {task.title}
            </span>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
