import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, Plus, LogOut, User as UserIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = ({ onOpenMobileMenu }) => {
  const {
    user,
    logout,
    globalSearch,
    setGlobalSearch,
    openCreateModal,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setGlobalSearch(val);
    if (location.pathname === '/profile') {
      navigate('/tasks');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Zone 1: Brand Title + Mobile Menu Trigger */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 -ml-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link
          to="/dashboard"
          className="text-base font-bold tracking-tight text-neutral-900 whitespace-nowrap"
        >
          TaskFlow
        </Link>
      </div>

      {/* Zone 2: Quick Search Input */}
      <div className="flex-1 max-w-md mx-auto hidden sm:block">
        <div className="relative">
          <Search
            className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={globalSearch}
            onChange={handleSearchChange}
            placeholder="Quick search tasks by title..."
            aria-label="Quick search tasks by title"
            className="w-full pl-9 pr-8 py-1.5 text-sm bg-neutral-50 border border-neutral-200 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-teal-700 transition-colors"
          />
          {globalSearch && (
            <button
              type="button"
              onClick={() => setGlobalSearch('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Zone 3: Primary Actions (New Task, Profile, Logout) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>

        <Link
          to="/profile"
          className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors whitespace-nowrap"
          title="View Profile"
        >
          <UserIcon className="w-3.5 h-3.5 text-neutral-500" />
          <span className="hidden md:inline max-w-[120px] truncate">
            {user?.name || 'Profile'}
          </span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          title="Log out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
