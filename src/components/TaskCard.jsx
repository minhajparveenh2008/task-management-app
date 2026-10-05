import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Pencil,
  Trash2,
  AlertCircle,
} from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return 'No date';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

const isOverdue = (dueDateStr, status) => {
  if (status === 'Completed' || !dueDateStr) return false;
  const due = new Date(dueDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
};

const TaskCard = ({
  task,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const isCompleted = task.status === 'Completed';
  const overdue = isOverdue(task.dueDate, task.status);

  const priorityIndicator = {
    High: {
      label: 'High Priority',
      textClass: 'text-red-700 font-semibold',
      marker: '▲',
    },
    Medium: {
      label: 'Medium Priority',
      textClass: 'text-amber-700 font-medium',
      marker: '■',
    },
    Low: {
      label: 'Low Priority',
      textClass: 'text-neutral-600 font-normal',
      marker: '▽',
    },
  }[task.priority] || {
    label: `${task.priority} Priority`,
    textClass: 'text-neutral-600',
    marker: '•',
  };

  const statusIndicator = {
    Completed: {
      label: 'Completed',
      textClass: 'text-teal-700 font-medium',
    },
    'In Progress': {
      label: 'In Progress',
      textClass: 'text-amber-700 font-medium',
    },
    Pending: {
      label: 'Pending',
      textClass: 'text-neutral-600 font-medium',
    },
  }[task.status] || {
    label: task.status,
    textClass: 'text-neutral-600',
  };

  const handleMarkComplete = async () => {
    if (updatingStatus) return;
    setUpdatingStatus(true);
    try {
      const nextStatus = isCompleted ? 'Pending' : 'Completed';
      await onStatusChange(task._id, nextStatus);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSelectStatus = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === task.status || updatingStatus) return;
    setUpdatingStatus(true);
    try {
      await onStatusChange(task._id, newStatus);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <article
      className={`bg-white border rounded-lg p-4 sm:p-5 transition-colors ${
        isCompleted
          ? 'border-neutral-200 bg-neutral-50/50'
          : 'border-neutral-200 hover:border-neutral-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left Content Column */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={updatingStatus}
            aria-label={isCompleted ? 'Mark task as pending' : 'Mark task as completed'}
            title={isCompleted ? 'Completed (Click to reopen)' : 'Mark Complete'}
            className="mt-0.5 text-neutral-400 hover:text-teal-700 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-teal-700" />
            ) : task.status === 'In Progress' ? (
              <Clock className="w-5 h-5 text-amber-600" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            {/* Primary Title */}
            <h3
              className={`text-base font-semibold leading-snug break-words ${
                isCompleted
                  ? 'line-through text-neutral-400'
                  : 'text-neutral-900'
              }`}
            >
              {task.title}
            </h3>

            {/* Description */}
            {task.description && (
              <p
                className={`mt-1.5 text-sm leading-relaxed break-words max-w-[72ch] ${
                  isCompleted ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Unboxed Metadata Line with Typographic Separators (Zero-Pill Discipline) */}
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
              <span className={priorityIndicator.textClass}>
                <span aria-hidden="true" className="mr-1 text-[10px]">
                  {priorityIndicator.marker}
                </span>
                {priorityIndicator.label}
              </span>

              <span aria-hidden="true" className="text-neutral-300">
                ·
              </span>

              <span className={statusIndicator.textClass}>
                Status: {statusIndicator.label}
              </span>

              <span aria-hidden="true" className="text-neutral-300">
                ·
              </span>

              <span
                className={`font-mono tabular-nums inline-flex items-center gap-1 ${
                  overdue ? 'text-red-700 font-medium' : 'text-neutral-500'
                }`}
              >
                {overdue && <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                Due {formatDate(task.dueDate)}
                {overdue ? ' (Overdue)' : ''}
              </span>

              <span aria-hidden="true" className="text-neutral-300">
                ·
              </span>

              <span className="font-mono tabular-nums text-neutral-400">
                Created {formatDate(task.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:self-start shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
          {/* Status Quick Switcher */}
          <select
            aria-label={`Change status for ${task.title}`}
            value={task.status}
            onChange={handleSelectStatus}
            disabled={updatingStatus}
            className="text-xs font-medium bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-md px-2 py-1.5 focus:outline-none focus:border-teal-700 transition-colors cursor-pointer"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Mark Complete Button */}
          {!isCompleted && (
            <button
              type="button"
              onClick={handleMarkComplete}
              disabled={updatingStatus}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100/80 border border-teal-700/20 rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Complete</span>
            </button>
          )}

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5 text-neutral-500" />
            <span>Edit</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDeleteRequest(task)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-red-700 bg-white hover:bg-red-50 border border-neutral-200 hover:border-red-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
