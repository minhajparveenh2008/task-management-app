import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

export const createApiRouter = () => {
  const apiRouter = express.Router();

  apiRouter.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'TaskFlow REST API' });
  });

  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/tasks', taskRoutes);

  apiRouter.use(notFound);
  apiRouter.use(errorHandler);

  return apiRouter;
};

// Standalone server execution when running `node server/server.js`
const isMainModule =
  import.meta.url === `file://${process.argv[1]}` ||
  (process.argv[1] && process.argv[1].endsWith('server/server.js'));

if (isMainModule) {
  const app = express();
  const PORT = process.env.PORT || 5000;

  connectDB();

  app.use(
    cors({
      origin: process.env.CLIENT_URL || '*',
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use('/api', createApiRouter());

  app.listen(PORT, () => {
    console.log(`TaskFlow Backend API running on port ${PORT}`);
  });
}
