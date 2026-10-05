import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import TaskForm from './components/TaskForm.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tasks from './pages/Tasks.jsx';
import Pending from './pages/Pending.jsx';
import Completed from './pages/Completed.jsx';
import Profile from './pages/Profile.jsx';

const WorkspaceLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    isTaskModalOpen,
    editingTask,
    closeTaskModal,
    createTask,
    updateTask,
    feedback,
    setFeedback,
  } = useAuth();

  const handleTaskFormSubmit = async (formData) => {
    if (editingTask && editingTask._id) {
      await updateTask(editingTask._id, formData);
    } else {
      await createTask(formData);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 flex flex-col">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      <div className="flex flex-1 min-w-0">
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Clean Toast Feedback Banner */}
            {feedback && (
              <div
                role="status"
                className={`mb-5 px-4 py-3 rounded-lg border flex items-center justify-between gap-3 text-xs font-medium ${
                  feedback.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-teal-50/90 border-teal-700/20 text-teal-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {feedback.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                  )}
                  <span>{feedback.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFeedback(null)}
                  aria-label="Dismiss notification"
                  className="text-neutral-400 hover:text-neutral-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <Outlet />
          </div>
        </main>
      </div>

      {/* Create / Edit Task Modal */}
      <TaskForm
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        onSubmit={handleTaskFormSubmit}
        initialData={editingTask}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Workspace Routes */}
          <Route
            element={
              <ProtectedRoute>
                <WorkspaceLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/pending" element={<Pending />} />
            <Route path="/completed" element={<Completed />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
