import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Task } from '../api/client';
import { TaskListPage } from './TaskListPage';

const sampleTasks: Task[] = [
  { id: 1, title: 'Buy milk', description: null, status: 'todo', due_date: null },
  { id: 2, title: 'Ship release', description: null, status: 'done', due_date: null },
];

vi.mock('../api/client', () => ({
  api: {
    listTasks: vi.fn(() => Promise.resolve(sampleTasks)),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  },
}));

describe('TaskListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists tasks and filters by status', async () => {
    const user = userEvent.setup();
    render(<TaskListPage onLogout={() => {}} />);

    // Both tasks visible under the default "All" filter.
    expect(await screen.findByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Ship release')).toBeInTheDocument();

    // Filtering to "To do" hides the done task.
    await user.click(screen.getByRole('button', { name: 'To do' }));
    await waitFor(() => {
      expect(screen.queryByText('Ship release')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });

  it('shows the completed count', async () => {
    render(<TaskListPage onLogout={() => {}} />);
    expect(await screen.findByText('1 of 2 done')).toBeInTheDocument();
  });
});
