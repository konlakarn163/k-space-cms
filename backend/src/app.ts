import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import postRoutes from './routes/postRoutes.js';
import storageRoutes from './routes/storageRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { env } from './config/env.js';
import { requireAuth } from './middleware/auth.js';

export const app = express();

const allowedOrigins = new Set(env.corsOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.has(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '12mb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'k-space-cms-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/me', requireAuth, (req: Request & { user?: unknown }, res: Response) => {
  res.json({ user: req.user });
});
