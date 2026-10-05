import Task from '../models/Task.js';

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];

// @desc    Get all tasks for authenticated user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sort } = req.query;

    const query = { user: req.user._id };

    if (status && status !== 'All' && VALID_STATUSES.includes(status)) {
      query.status = status;
    }

    if (priority && priority !== 'All' && VALID_PRIORITIES.includes(priority)) {
      query.priority = priority;
    }

    let sortSpec = { createdAt: -1 };
    if (sort === 'oldest') {
      sortSpec = { createdAt: 1 };
    } else if (sort === 'dueDate') {
      sortSpec = { dueDate: 1 };
    }

    let tasks = await Task.find(query).sort(sortSpec);

    if (search && String(search).trim()) {
      const term = String(search).trim().toLowerCase();
      tasks = tasks.filter((t) => t.title.toLowerCase().includes(term));
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Ensure authenticated user owns this task
    if (String(task.user) !== String(req.user._id)) {
      res.status(403);
      throw new Error('Unauthorized access: you do not have permission to view this task');
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    if (!title || !String(title).trim()) {
      res.status(400);
      throw new Error('Task title is required');
    }

    if (!dueDate || Number.isNaN(new Date(dueDate).getTime())) {
      res.status(400);
      throw new Error('A valid due date is required');
    }

    const taskPriority = priority || 'Medium';
    if (!VALID_PRIORITIES.includes(taskPriority)) {
      res.status(400);
      throw new Error('Priority must be Low, Medium, or High');
    }

    const taskStatus = status || 'Pending';
    if (!VALID_STATUSES.includes(taskStatus)) {
      res.status(400);
      throw new Error('Status must be Pending, In Progress, or Completed');
    }

    const task = await Task.create({
      user: req.user._id,
      title: String(title).trim(),
      description: description ? String(description).trim() : '',
      priority: taskPriority,
      status: taskStatus,
      dueDate: new Date(dueDate),
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Ensure authenticated user owns the task
    if (String(task.user) !== String(req.user._id)) {
      res.status(403);
      throw new Error('Unauthorized access: you cannot modify another user\'s task');
    }

    const { title, description, priority, status, dueDate } = req.body;

    if (title !== undefined && !String(title).trim()) {
      res.status(400);
      throw new Error('Task title cannot be empty');
    }

    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
      res.status(400);
      throw new Error('Priority must be Low, Medium, or High');
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      res.status(400);
      throw new Error('Status must be Pending, In Progress, or Completed');
    }

    if (dueDate !== undefined && (!dueDate || Number.isNaN(new Date(dueDate).getTime()))) {
      res.status(400);
      throw new Error('Please provide a valid due date');
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: title !== undefined ? String(title).trim() : task.title,
        description: description !== undefined ? String(description).trim() : task.description,
        priority: priority !== undefined ? priority : task.priority,
        status: status !== undefined ? status : task.status,
        dueDate: dueDate !== undefined ? new Date(dueDate) : task.dueDate,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status only
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      res.status(400);
      throw new Error('Valid status is required (Pending, In Progress, or Completed)');
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (String(task.user) !== String(req.user._id)) {
      res.status(403);
      throw new Error('Unauthorized access: you cannot modify another user\'s task');
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Task marked as ${status}`,
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (String(task.user) !== String(req.user._id)) {
      res.status(403);
      throw new Error('Unauthorized access: you cannot delete another user\'s task');
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
