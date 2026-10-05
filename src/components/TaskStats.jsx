import React from 'react';

const TaskStats = ({ tasks = [] }) => {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;

  const completionPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  const metrics = [
    {
      label: 'Total Tasks',
      value: total,
      subtext: 'All workspace items',
      accentClass: 'text-neutral-900',
    },
    {
      label: 'Pending',
      value: pending,
      subtext: 'Awaiting start',
      accentClass: 'text-neutral-800',
    },
    {
      label: 'In Progress',
      value: inProgress,
      subtext: 'Currently active',
      accentClass: 'text-amber-700',
    },
    {
      label: 'Completed',
      value: completed,
      subtext: `${completionPercentage}% completion rate`,
      accentClass: 'text-teal-700',
    },
  ];

  return (
    <section aria-label="Task summary statistics" className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      {/* 4-Column Stat Grid with Hairline Dividers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 sm:divide-x divide-neutral-200">
        {metrics.map((metric) => (
          <div key={metric.label} className="p-5 flex flex-col justify-between">
            <span className="text-xs font-medium text-neutral-500">
              {metric.label}
            </span>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <span
                className={`text-2xl sm:text-3xl font-semibold font-mono tabular-nums tracking-tight ${metric.accentClass}`}
              >
                {metric.value}
              </span>
              <span className="text-xs text-neutral-400 font-mono tabular-nums truncate">
                {metric.subtext}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Subtle Progress Indicator Bar */}
      <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-xs font-medium text-neutral-600 whitespace-nowrap">
            Overall Progress
          </span>
          <div className="w-full max-w-xs h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-700 transition-all duration-200"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
        <span className="text-xs font-mono tabular-nums font-medium text-neutral-700 whitespace-nowrap">
          {completed} of {total} completed ({completionPercentage}%)
        </span>
      </div>
    </section>
  );
};

export default TaskStats;
