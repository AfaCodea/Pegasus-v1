import { Response } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';
import { AuthedRequest } from '../middleware/auth';

const taskInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  due_date: z.string().optional(),
});

export async function listTasks(req: AuthedRequest, res: Response) {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
    [req.userId]
  );
  res.json(result.rows);
}

export async function createTask(req: AuthedRequest, res: Response) {
  const parsed = taskInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { title, description, status, due_date } = parsed.data;

  const result = await pool.query(
    `INSERT INTO tasks (user_id, title, description, status, due_date)
     VALUES ($1, $2, $3, COALESCE($4, 'todo'), $5)
     RETURNING *`,
    [req.userId, title, description ?? null, status ?? null, due_date ?? null]
  );
  res.status(201).json(result.rows[0]);
}

export async function updateTask(req: AuthedRequest, res: Response) {
  const parsed = taskInputSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { id } = req.params;
  const fields = parsed.data;

  const existing = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [
    id,
    req.userId,
  ]);
  if (existing.rows.length === 0) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const merged = { ...existing.rows[0], ...fields };
  const result = await pool.query(
    `UPDATE tasks SET title = $1, description = $2, status = $3, due_date = $4, updated_at = now()
     WHERE id = $5 AND user_id = $6 RETURNING *`,
    [merged.title, merged.description, merged.status, merged.due_date, id, req.userId]
  );
  res.json(result.rows[0]);
}

export async function deleteTask(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id', [
    id,
    req.userId,
  ]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(204).send();
}
