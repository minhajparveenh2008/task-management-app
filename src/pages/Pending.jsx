import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import SearchBar from '../components/SearchBar.jsx';
import TaskList from '../components/TaskList.jsx';

const Pending = () => {
  const {
    tasks,
    tasksLoading,
    tasksError,
    globalSearch,
    setGlobalSearch,
    openCreateModal,
    openEditModal,
    deleteTask,
    updateTaskStatus,
  } = useAuth();

  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');

  const pendingTasks = useMemo(() => {
    let result = tasks.filter((t) => t.status === 'Pending');

    if (globalSearch.trim()) {
      const term = globalSearch.trim().toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(term));
    }

    if (priorityFilter !== 'All') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [tasks, globalSearch, priorityFilter, sortBy]);

  const hasActiveFilters =
    Boolean(globalSearch.trim()) ||
    priorityFilter !== 'All' ||
    sortBy !== 'dueDate';

  const handleClearFilters = () => {
    setGlobalSearch('');
    setPriorityFilter('All');
    setSortBy('dueDate');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Pending Tasks
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Tasks awaiting action, ordered by upcoming deadlines.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors self-start sm:self-auto cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      <SearchBar
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        hideStatusFilter
      />

      <TaskList
        tasks={pendingTasks}
        loading={tasksLoading}
        error={tasksError}
        emptyMessage="No pending tasks right now. You are all caught up."
        onEditTask={openEditModal}
        onDeleteTask={deleteTask}
        onStatusChange={updateTaskStatus}
        onCreateTask={openCreateModal}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};

export default Pending;
