import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';

const STATUS_OPTIONS = ['All', 'Pending', 'In Progress', 'Completed'];
const PRIORITY_OPTIONS = ['All', 'Low', 'Medium', 'High'];

const SearchBar = ({
  searchQuery,
  onSearchChange,
  statusFilter = 'All',
  onStatusChange,
  priorityFilter = 'All',
  onPriorityChange,
  sortBy = 'newest',
  onSortChange,
  hideStatusFilter = false,
}) => {
  const hasActiveFilters =
    Boolean(searchQuery && searchQuery.trim()) ||
    (!hideStatusFilter && statusFilter !== 'All') ||
    priorityFilter !== 'All' ||
    sortBy !== 'newest';

  const handleReset = () => {
    onSearchChange('');
    if (!hideStatusFilter && onStatusChange) onStatusChange('All');
    if (onPriorityChange) onPriorityChange('All');
    if (onSortChange) onSortChange('newest');
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search
            className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title..."
            aria-label="Search tasks by title"
            className="w-full pl-9 pr-9 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-teal-700 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Interactive Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Segmented Control */}
          {!hideStatusFilter && onStatusChange && (
            <div
              className="inline-flex items-center p-1 bg-neutral-100 rounded-md overflow-x-auto max-w-full"
              role="group"
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((status) => {
                const active = statusFilter === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => onStatusChange(status)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          )}

          {/* Priority Filter Select */}
          {onPriorityChange && (
            <div className="flex items-center gap-1.5">
              <label htmlFor="priority-filter" className="text-xs text-neutral-500 whitespace-nowrap">
                Priority:
              </label>
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(e) => onPriorityChange(e.target.value)}
                className="text-xs font-medium bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-teal-700 transition-colors"
              >
                {PRIORITY_OPTIONS.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority === 'All' ? 'All Priorities' : priority}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort Select */}
          {onSortChange && (
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" aria-hidden="true" />
              <label htmlFor="sort-tasks" className="sr-only">
                Sort tasks
              </label>
              <select
                id="sort-tasks"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="text-xs font-medium bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-teal-700 transition-colors"
              >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="dueDate">Sort: Due Date</option>
              </select>
            </div>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-medium text-teal-700 hover:text-teal-800 px-2 py-1 whitespace-nowrap transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
