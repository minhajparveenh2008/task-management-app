import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  Clock,
  CheckCircle2,
  User,
  X,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Sidebar = ({ isOpen, onClose }) => {
  const { tasks, openCreateModal, user } = useAuth();

  const totalCount = tasks.length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      count: null,
    },
    {
      name: 'My Tasks',
      path: '/tasks',
      icon: ListTodo,
      count: totalCount,
    },
    {
      name: 'Pending',
      path: '/pending',
      icon: Clock,
      count: pendingCount,
    },
    {
      name: 'Completed',
      path: '/completed',
      icon: CheckCircle2,
      count: completedCount,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
      count: null,
    },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between py-5 px-3.5 bg-white select-none">
      <div className="space-y-6">
        {/* Workspace Header */}
        <div className="px-2.5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-900 tracking-tight">
              Workspace
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">
              Plan. Track. Complete.
            </p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="lg:hidden p-1.5 text-neutral-500 hover:text-neutral-900 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Create Action */}
        <div className="px-1">
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              openCreateModal();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-teal-800 bg-teal-50/80 hover:bg-teal-100/80 border border-teal-700/20 rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Task</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (onClose) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-neutral-400'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.count !== null && (
                      <span
                        className={`text-xs font-mono tabular-nums ${
                          isActive ? 'text-neutral-300' : 'text-neutral-400'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Account Info */}
      {user && (
        <div className="pt-4 border-t border-neutral-200 px-2.5">
          <p className="text-xs font-medium text-neutral-900 truncate">
            {user.name}
          </p>
          <p className="text-xs text-neutral-500 truncate mt-0.5">
            {user.email}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 border-r border-neutral-200 bg-white min-h-[calc(100vh-3.5rem)]">
        <div className="sticky top-14 h-[calc(100vh-3.5rem)]">
          {renderSidebarContent()}
        </div>
      </aside>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-neutral-900/40 transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-64 max-w-[80vw] bg-white h-full border-r border-neutral-200 shadow-lg">
            {renderSidebarContent()}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
