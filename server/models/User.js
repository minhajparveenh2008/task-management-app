import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  isMongoConnected,
  readLocalStore,
  writeLocalStore,
  generateObjectId,
  isValidObjectId,
} from '../config/db.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
    maxlength: [80, 'Name cannot exceed 80 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare candidate password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);

const decorateUserDoc = (rawUser) => {
  if (!rawUser) return null;
  return {
    ...rawUser,
    _id: String(rawUser._id),
    async matchPassword(enteredPassword) {
      return await bcrypt.compare(enteredPassword, rawUser.password);
    },
    toObject() {
      return { ...rawUser };
    },
  };
};

const User = {
  schema: userSchema,
  model: MongooseUser,

  async findOne(query) {
    if (isMongoConnected()) {
      return await MongooseUser.findOne(query);
    }
    const store = readLocalStore();
    const found = store.users.find((u) => {
      if (query.email && u.email.toLowerCase() !== String(query.email).toLowerCase()) return false;
      if (query._id && String(u._id) !== String(query._id)) return false;
      return true;
    });
    return decorateUserDoc(found || null);
  },

  findById(id) {
    if (isMongoConnected()) {
      return MongooseUser.findById(id);
    }
    const resolveUser = (excludePassword = false) => {
      if (!isValidObjectId(id)) {
        const err = new Error(`Cast to ObjectId failed for value "${id}"`);
        err.name = 'CastError';
        throw err;
      }
      const store = readLocalStore();
      const found = store.users.find((u) => String(u._id) === String(id));
      if (!found) return null;
      const copy = { ...found };
      if (excludePassword) {
        delete copy.password;
      }
      return decorateUserDoc(copy);
    };

    return {
      select(fields) {
        const excludePass = typeof fields === 'string' && fields.includes('-password');
        return Promise.resolve().then(() => resolveUser(excludePass));
      },
      then(onFulfilled, onRejected) {
        return Promise.resolve().then(() => resolveUser(false)).then(onFulfilled, onRejected);
      },
    };
  },

  async create(data) {
    if (isMongoConnected()) {
      return await MongooseUser.create(data);
    }
    const store = readLocalStore();
    const normalizedEmail = String(data.email || '').trim().toLowerCase();
    const exists = store.users.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      const err = new Error('Duplicate field value entered');
      err.code = 11000;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = {
      _id: generateObjectId(),
      name: String(data.name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    store.users.push(newUser);
    writeLocalStore(store);
    return decorateUserDoc(newUser);
  },
};

export default User;
