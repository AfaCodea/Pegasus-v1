import cors from 'cors';
import express from 'express';
import { authRoutes } from './routes/authRoutes';
import { taskRoutes } from './routes/taskRoutes';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);

  return app;
}
