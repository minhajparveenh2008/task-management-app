import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import SearchBar from '../components/SearchBar.jsx';
import TaskList from '../components/TaskList.jsx';

const Tasks = () => {
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

  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (globalSearch.trim()) {
      const term = globalSearch.trim().toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(term));
    }

    if (statusFilter !== 'All') {
      result = result.filter((t) => t.status === statusFilter);
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
  }, [tasks, globalSearch, statusFilter, priorityFilter, sortBy]);

  const hasActiveFilters =
    Boolean(globalSearch.trim()) ||
    statusFilter !== 'All' ||
    priorityFilter !== 'All' ||
    sortBy !== 'newest';

  const handleClearFilters = () => {
    setGlobalSearch('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            My Tasks
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Search, filter, and manage all tasks in your personal workspace.
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
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <TaskList
        tasks={filteredTasks}
        loading={tasksLoading}
        error={tasksError}
        emptyMessage="No tasks yet. Create your first task to get started."
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

export default Tasks;
