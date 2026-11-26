import { useEffect, useMemo, useState } from 'react';
import { api, Task, TaskInput, TaskStatus } from '../api/client';
import { TaskForm } from '../components/TaskForm';
import { TaskItem } from '../components/TaskItem';

type Filter = 'all' | TaskStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
];

interface Props {
  onLogout: () => void;
}

export function TaskListPage({ onLogout }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listTasks()
      .then(setTasks)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load tasks'))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(input: TaskInput) {
    const task = await api.createTask(input);
    setTasks((prev) => [task, ...prev]);
  }

  async function handleUpdate(id: number, fields: Partial<TaskInput>) {
    const updated = await api.updateTask(id, fields);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleDelete(id: number) {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const visible = useMemo(
    () => (filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)),
    [tasks, filter]
  );

  const counts = useMemo(
    () => ({
      total: tasks.length,
      done: tasks.filter((t) => t.status === 'done').length,
    }),
    [tasks]
  );

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Tasks</h1>
          <p className="page__subtitle">
            {counts.done} of {counts.total} done
          </p>
        </div>
        <button className="btn-secondary" onClick={onLogout}>
          Log out
        </button>
      </header>

      <section className="card">
        <h2 className="card__title">Add a task</h2>
        <TaskForm submitLabel="Add task" onSubmit={handleCreate} />
      </section>

      <nav className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`filter ${filter === f.value ? 'filter--active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </nav>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="muted">No tasks here yet.</p>
      ) : (
        <ul className="task-list">
          {visible.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
