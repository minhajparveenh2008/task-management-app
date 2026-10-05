import mongoose from 'mongoose';
import {
  isMongoConnected,
  readLocalStore,
  writeLocalStore,
  generateObjectId,
  isValidObjectId,
} from '../config/db.js';

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [140, 'Task title cannot exceed 140 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be Low, Medium, or High',
      },
      default: 'Medium',
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Pending', 'In Progress', 'Completed'],
        message: 'Status must be Pending, In Progress, or Completed',
      },
      default: 'Pending',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
  },
  {
    timestamps: true,
  }
);

const MongooseTask = mongoose.models.Task || mongoose.model('Task', taskSchema);

const decorateTaskDoc = (rawTask) => {
  if (!rawTask) return null;
  return {
    ...rawTask,
    _id: String(rawTask._id),
    user: String(rawTask.user),
    async save() {
      const store = readLocalStore();
      const idx = store.tasks.findIndex((t) => String(t._id) === String(this._id));
      const updated = {
        _id: String(this._id),
        user: String(this.user),
        title: String(this.title).trim(),
        description: String(this.description || '').trim(),
        priority: this.priority,
        status: this.status,
        dueDate: new Date(this.dueDate).toISOString(),
        createdAt: this.createdAt,
        updatedAt: new Date().toISOString(),
      };
      if (idx !== -1) {
        store.tasks[idx] = updated;
        writeLocalStore(store);
      }
      Object.assign(this, updated);
      return this;
    },
    async deleteOne() {
      const store = readLocalStore();
      store.tasks = store.tasks.filter((t) => String(t._id) !== String(this._id));
      writeLocalStore(store);
      return { acknowledged: true, deletedCount: 1 };
    },
  };
};

const Task = {
  schema: taskSchema,
  model: MongooseTask,

  find(query = {}) {
    if (isMongoConnected()) {
      return MongooseTask.find(query);
    }
    const executeQuery = (sortSpec = { createdAt: -1 }) => {
      const store = readLocalStore();
      let results = store.tasks.filter((t) => {
        if (query.user && String(t.user) !== String(query.user)) return false;
        if (query.status && t.status !== query.status) return false;
        if (query.priority && t.priority !== query.priority) return false;
        return true;
      });

      const sortKey = Object.keys(sortSpec)[0] || 'createdAt';
      const sortDir = sortSpec[sortKey] === 1 ? 1 : -1;

      results.sort((a, b) => {
        const valA = new Date(a[sortKey] || 0).getTime();
        const valB = new Date(b[sortKey] || 0).getTime();
        return (valA - valB) * sortDir;
      });

      return results.map(decorateTaskDoc);
    };

    return {
      sort(sortSpec) {
        return Promise.resolve().then(() => executeQuery(sortSpec));
      },
      then(onFulfilled, onRejected) {
        return Promise.resolve().then(() => executeQuery()).then(onFulfilled, onRejected);
      },
    };
  },

  async findById(id) {
    if (isMongoConnected()) {
      return await MongooseTask.findById(id);
    }
    if (!isValidObjectId(id)) {
      const err = new Error(`Cast to ObjectId failed for value "${id}"`);
      err.name = 'CastError';
      throw err;
    }
    const store = readLocalStore();
    const found = store.tasks.find((t) => String(t._id) === String(id));
    return decorateTaskDoc(found || null);
  },

  async create(data) {
    if (isMongoConnected()) {
      return await MongooseTask.create(data);
    }
    const now = new Date().toISOString();
    const newTask = {
      _id: generateObjectId(),
      user: String(data.user),
      title: String(data.title).trim(),
      description: String(data.description || '').trim(),
      priority: data.priority || 'Medium',
      status: data.status || 'Pending',
      dueDate: new Date(data.dueDate).toISOString(),
      createdAt: now,
      updatedAt: now,
    };

    const store = readLocalStore();
    store.tasks.unshift(newTask);
    writeLocalStore(store);
    return decorateTaskDoc(newTask);
  },

  async findByIdAndUpdate(id, updateData, options = { new: true }) {
    if (isMongoConnected()) {
      return await MongooseTask.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
        ...options,
      });
    }
    if (!isValidObjectId(id)) {
      const err = new Error(`Cast to ObjectId failed for value "${id}"`);
      err.name = 'CastError';
      throw err;
    }
    const store = readLocalStore();
    const idx = store.tasks.findIndex((t) => String(t._id) === String(id));
    if (idx === -1) return null;

    const current = store.tasks[idx];
    const updated = {
      ...current,
      ...(updateData.title !== undefined ? { title: String(updateData.title).trim() } : {}),
      ...(updateData.description !== undefined ? { description: String(updateData.description).trim() } : {}),
      ...(updateData.priority !== undefined ? { priority: updateData.priority } : {}),
      ...(updateData.status !== undefined ? { status: updateData.status } : {}),
      ...(updateData.dueDate !== undefined ? { dueDate: new Date(updateData.dueDate).toISOString() } : {}),
      updatedAt: new Date().toISOString(),
    };

    store.tasks[idx] = updated;
    writeLocalStore(store);
    return decorateTaskDoc(updated);
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected()) {
      return await MongooseTask.findByIdAndDelete(id);
    }
    if (!isValidObjectId(id)) {
      const err = new Error(`Cast to ObjectId failed for value "${id}"`);
      err.name = 'CastError';
      throw err;
    }
    const store = readLocalStore();
    const idx = store.tasks.findIndex((t) => String(t._id) === String(id));
    if (idx === -1) return null;
    const [removed] = store.tasks.splice(idx, 1);
    writeLocalStore(store);
    return decorateTaskDoc(removed);
  },
};

export default Task;
