import { FormEvent, useState } from 'react';
import { Task, TaskInput, TaskStatus } from '../api/client';

interface Props {
  initial?: Task;
  submitLabel: string;
  onSubmit: (input: TaskInput) => Promise<void> | void;
  onCancel?: () => void;
}

const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done'];
const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
};

export function TaskForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? 'todo');
  const [dueDate, setDueDate] = useState(initial?.due_date ?? '');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        status,
        due_date: dueDate || null,
      });
      if (!initial) {
        setTitle('');
        setDescription('');
        setStatus('todo');
        setDueDate('');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        className="task-form__title"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="task-form__description"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />
      <div className="task-form__row">
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Due date
          <input type="date" value={dueDate ?? ''} onChange={(e) => setDueDate(e.target.value)} />
        </label>
      </div>
      <div className="task-form__actions">
        <button type="submit" disabled={busy}>
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export { STATUS_LABELS };
