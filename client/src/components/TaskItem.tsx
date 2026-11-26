import { useState } from 'react';
import { Task, TaskInput } from '../api/client';
import { STATUS_LABELS, TaskForm } from './TaskForm';

interface Props {
  task: Task;
  onUpdate: (id: number, fields: Partial<TaskInput>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskItem({ task, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="task-item task-item--editing">
        <TaskForm
          initial={task}
          submitLabel="Save"
          onCancel={() => setEditing(false)}
          onSubmit={async (input) => {
            await onUpdate(task.id, input);
            setEditing(false);
          }}
        />
      </li>
    );
  }

  const done = task.status === 'done';

  return (
    <li className={`task-item ${done ? 'task-item--done' : ''}`}>
      <input
        type="checkbox"
        className="task-item__check"
        checked={done}
        onChange={() => onUpdate(task.id, { status: done ? 'todo' : 'done' })}
        aria-label={done ? 'Mark as not done' : 'Mark as done'}
      />
      <div className="task-item__body">
        <span className="task-item__title">{task.title}</span>
        {task.description && <p className="task-item__description">{task.description}</p>}
        <div className="task-item__meta">
          <span className={`badge badge--${task.status}`}>{STATUS_LABELS[task.status]}</span>
          {task.due_date && <span className="badge badge--due">Due {task.due_date}</span>}
        </div>
      </div>
      <div className="task-item__actions">
        <button className="btn-secondary" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button className="btn-danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}
