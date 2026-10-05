import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

let mongoConnected = false;

export const isMongoConnected = () => mongoConnected && mongoose.connection.readyState === 1;

const DATA_FILE = path.resolve(process.cwd(), 'server', '.taskflow-data.json');

const getInitialSeedData = () => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('Password123!', salt);
  const demoUserId = '6701a1b2c3d4e5f6a7b8c9d0';
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;

  return {
    users: [
      {
        _id: demoUserId,
        name: 'Alex Morgan',
        email: 'alex@taskflow.io',
        password: hashedPassword,
        createdAt: new Date(now.getTime() - 14 * dayMs).toISOString(),
      },
    ],
    tasks: [
      {
        _id: '6701a1b2c3d4e5f6a7b8c9d1',
        user: demoUserId,
        title: 'Finalize REST API authentication middleware & JWT verification',
        description: 'Ensure all /api/tasks endpoints validate Bearer tokens, attach req.user, and enforce strict per-user authorization checks.',
        priority: 'High',
        status: 'Completed',
        dueDate: new Date(now.getTime() - 2 * dayMs).toISOString(),
        createdAt: new Date(now.getTime() - 6 * dayMs).toISOString(),
        updatedAt: new Date(now.getTime() - 2 * dayMs).toISOString(),
      },
      {
        _id: '6701a1b2c3d4e5f6a7b8c9d2',
        user: demoUserId,
        title: 'Design responsive workspace layout and mobile navigation drawer',
        description: 'Implement collapsible sidebar navigation for tablet and mobile viewports with zero horizontal overflow and accessible touch targets.',
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date(now.getTime() + 1 * dayMs).toISOString(),
        createdAt: new Date(now.getTime() - 4 * dayMs).toISOString(),
        updatedAt: new Date(now.getTime() - 1 * dayMs).toISOString(),
      },
      {
        _id: '6701a1b2c3d4e5f6a7b8c9d3',
        user: demoUserId,
        title: 'Configure MongoDB Atlas production cluster and IP whitelist',
        description: 'Set up M0 cluster on MongoDB Atlas, create database user credentials, and configure MONGODB_URI in Render environment variables.',
        priority: 'Medium',
        status: 'Pending',
        dueDate: new Date(now.getTime() + 3 * dayMs).toISOString(),
        createdAt: new Date(now.getTime() - 3 * dayMs).toISOString(),
        updatedAt: new Date(now.getTime() - 3 * dayMs).toISOString(),
      },
      {
        _id: '6701a1b2c3d4e5f6a7b8c9d4',
        user: demoUserId,
        title: 'Implement client-side search, priority filtering, and date sorting',
        description: 'Allow users to filter tasks by status (Pending, In Progress, Completed), priority level (Low, Medium, High), and sort by due date or creation date.',
        priority: 'Medium',
        status: 'In Progress',
        dueDate: new Date(now.getTime() + 2 * dayMs).toISOString(),
        createdAt: new Date(now.getTime() - 2 * dayMs).toISOString(),
        updatedAt: new Date(now.getTime() - 12 * 3600 * 1000).toISOString(),
      },
      {
        _id: '6701a1b2c3d4e5f6a7b8c9d5',
        user: demoUserId,
        title: 'Write comprehensive API documentation and Thiranex submission README',
        description: 'Document installation steps, environment variables, REST API endpoints, Render/Vercel deployment instructions, and submission checklist.',
        priority: 'Low',
        status: 'Pending',
        dueDate: new Date(now.getTime() + 5 * dayMs).toISOString(),
        createdAt: new Date(now.getTime() - 1 * dayMs).toISOString(),
        updatedAt: new Date(now.getTime() - 1 * dayMs).toISOString(),
      },
    ],
  };
};

export const readLocalStore = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = getInitialSeedData();
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return getInitialSeedData();
  }
};

export const writeLocalStore = (data) => {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local store:', err.message);
  }
};

export const generateObjectId = () => {
  return new mongoose.Types.ObjectId().toString();
};

export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && !uri.includes('<username>') && !uri.includes('MY_MONGODB_URI')) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      mongoConnected = true;
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn(`MongoDB connection failed (${error.message}). Using local persistent store fallback.`);
    }
  } else {
    console.log('MONGODB_URI not configured or placeholder detected. Running with local persistent store (Mongoose schema compatible).');
  }

  mongoConnected = false;
  readLocalStore();
};

export default connectDB;
