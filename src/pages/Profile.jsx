import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Profile = () => {
  const { user, logout, tasks } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formattedCreatedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'October 2026';

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Account Profile
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Your personal TaskFlow account information and session controls.
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg divide-y divide-neutral-200">
        {/* Full Name */}
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-neutral-400 shrink-0" />
            <div>
              <p className="text-xs font-medium text-neutral-500">Full Name</p>
              <p className="text-sm font-semibold text-neutral-900 mt-0.5">
                {user?.name || 'User'}
              </p>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
            <div>
              <p className="text-xs font-medium text-neutral-500">
                Email Address
              </p>
              <p className="text-sm font-semibold text-neutral-900 mt-0.5">
                {user?.email || '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Account Creation Date */}
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
            <div>
              <p className="text-xs font-medium text-neutral-500">
                Account Creation Date
              </p>
              <p className="text-sm font-mono tabular-nums font-semibold text-neutral-900 mt-0.5">
                {formattedCreatedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Workspace Summary */}
        <div className="p-5 flex items-center justify-between gap-4 bg-neutral-50/50">
          <div>
            <p className="text-xs font-medium text-neutral-500">
              Workspace Activity
            </p>
            <p className="text-sm font-mono tabular-nums text-neutral-800 mt-0.5">
              {completedCount} completed of {totalCount} total tasks
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
