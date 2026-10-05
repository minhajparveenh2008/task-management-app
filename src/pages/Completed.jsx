import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import SearchBar from '../components/SearchBar.jsx';
import TaskList from '../components/TaskList.jsx';

const Completed = () => {
  const {
    tasks,
    tasksLoading,
    tasksError,
    globalSearch,
    setGlobalSearch,
    openEditModal,
    deleteTask,
    updateTaskStatus,
  } = useAuth();

  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const completedTasks = useMemo(() => {
    let result = tasks.filter((t) => t.status === 'Completed');

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
    sortBy !== 'newest';

  const handleClearFilters = () => {
    setGlobalSearch('');
    setPriorityFilter('All');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Completed Tasks
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Archive of completed tasks. You can reopen or edit any item if needed.
        </p>
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
        tasks={completedTasks}
        loading={tasksLoading}
        error={tasksError}
        emptyMessage="No completed tasks yet. Mark a task as complete to see it here."
        onEditTask={openEditModal}
        onDeleteTask={deleteTask}
        onStatusChange={updateTaskStatus}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};

export default Completed;
