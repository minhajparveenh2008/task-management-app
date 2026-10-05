import React, { useState } from 'react';
import { Plus, ClipboardList, AlertTriangle } from 'lucide-react';
import TaskCard from './TaskCard.jsx';

const TaskList = ({
  tasks = [],
  loading = false,
  error = null,
  emptyMessage = 'No tasks yet. Create your first task to get started.',
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onCreateTask,
  hasActiveFilters = false,
  onClearFilters,
}) => {
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!taskToDelete || deleting) return;
    setDeleting(true);
    try {
      await onDeleteTask(taskToDelete._id);
      setTaskToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading tasks">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white border border-neutral-200 rounded-lg p-5 animate-pulse"
          >
            <div className="h-4 bg-neutral-200 rounded w-1/3 mb-3" />
            <div className="h-3 bg-neutral-100 rounded w-2/3 mb-4" />
            <div className="h-3 bg-neutral-100 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-5 text-sm text-red-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-lg py-12 px-6 text-center">
        <ClipboardList className="w-8 h-8 text-neutral-400 mx-auto mb-3 stroke-[1.5]" />
        <h3 className="text-sm font-semibold text-neutral-900">
          {hasActiveFilters ? 'No matching tasks found' : 'No tasks found'}
        </h3>
        <p className="text-sm text-neutral-500 mt-1 max-w-md mx-auto">
          {hasActiveFilters
            ? 'No tasks match your current search or filter criteria.'
            : emptyMessage}
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          {hasActiveFilters && onClearFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          ) : (
            onCreateTask && (
              <button
                type="button"
                onClick={onCreateTask}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Task</span>
              </button>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEditTask}
            onDeleteRequest={(t) => setTaskToDelete(t)}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="bg-white border border-neutral-200 rounded-lg max-w-md w-full p-6 shadow-lg">
            <h3
              id="delete-modal-title"
              className="text-base font-semibold text-neutral-900"
            >
              Delete Task
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              Are you sure you want to delete this task?
            </p>
            <p className="mt-2 text-xs font-medium text-neutral-800 bg-neutral-50 border border-neutral-200 rounded p-2.5 truncate">
              {taskToDelete.title}
            </p>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskList;
