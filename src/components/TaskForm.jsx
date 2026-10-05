import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const getTodayDateInput = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateForInput = (dateVal) => {
  if (!dateVal) return getTodayDateInput();
  const d = new Date(dateVal);
  if (Number.isNaN(d.getTime())) return getTodayDateInput();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const TaskForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const isEditing = Boolean(initialData && initialData._id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState(getTodayDateInput());
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'Medium');
      setStatus(initialData.status || 'Pending');
      setDueDate(formatDateForInput(initialData.dueDate));
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStatus('Pending');
      setDueDate(getTodayDateInput());
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    if (!dueDate) {
      setError('Due date is required.');
      return;
    }

    if (!['Low', 'Medium', 'High'].includes(priority)) {
      setError('Please select a valid priority.');
      return;
    }

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      setError('Please select a valid status.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        dueDate,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-form-title"
    >
      <div className="bg-white border border-neutral-200 rounded-lg max-w-lg w-full overflow-hidden shadow-lg">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2
              id="task-form-title"
              className="text-base font-semibold text-neutral-900"
            >
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isEditing
                ? 'Update task details, priority, or status below.'
                : 'Add a task to your workspace with priority and due date.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          {error && (
            <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-semibold text-neutral-800 mb-1.5"
            >
              Title <span className="text-red-600">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Prepare Q4 sprint planning presentation"
              maxLength={140}
              required
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-teal-700 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-description"
              className="block text-xs font-semibold text-neutral-800 mb-1.5"
            >
              Description
            </label>
            <textarea
              id="task-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key notes, deliverables, or acceptance criteria..."
              maxLength={1000}
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-teal-700 transition-colors resize-y"
            />
          </div>

          {/* Priority, Status, Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Priority */}
            <div>
              <label
                htmlFor="task-priority"
                className="block text-xs font-semibold text-neutral-800 mb-1.5"
              >
                Priority <span className="text-red-600">*</span>
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:border-teal-700 transition-colors"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="task-status"
                className="block text-xs font-semibold text-neutral-800 mb-1.5"
              >
                Status <span className="text-red-600">*</span>
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:border-teal-700 transition-colors"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="task-due-date"
                className="block text-xs font-semibold text-neutral-800 mb-1.5"
              >
                Due Date <span className="text-red-600">*</span>
              </label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:border-teal-700 transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting
                ? isEditing
                  ? 'Saving Changes...'
                  : 'Creating Task...'
                : isEditing
                ? 'Save Changes'
                : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
