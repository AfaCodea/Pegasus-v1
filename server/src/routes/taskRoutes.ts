import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createTask, deleteTask, listTasks, updateTask } from '../controllers/taskController';

export const taskRoutes = Router();

taskRoutes.use(requireAuth);
taskRoutes.get('/', listTasks);
taskRoutes.post('/', createTask);
taskRoutes.patch('/:id', updateTask);
taskRoutes.delete('/:id', deleteTask);
