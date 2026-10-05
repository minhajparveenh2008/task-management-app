import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService.js';
import { taskApi } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getStoredUser());
  const [token, setToken] = useState(() => authService.getStoredToken());
  const [authLoading, setAuthLoading] = useState(true);

  // Shared tasks state across Dashboard, My Tasks, Pending, Completed views
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);

  // Global search & modal controls
  const [globalSearch, setGlobalSearch] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Clean notification feedback banner
  const [feedback, setFeedback] = useState(null);

  const showFeedback = useCallback((message, type = 'success') => {
    setFeedback({ message, type, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const fetchTasks = useCallback(async () => {
    if (!authService.getStoredToken()) {
      setTasks([]);
      return;
    }
    setTasksLoading(true);
    setTasksError(null);
    try {
      const response = await taskApi.getAll();
      setTasks(response.tasks || []);
    } catch (error) {
      setTasksError(error.message || 'Unable to load tasks');
      if (error.status === 401) {
        authService.logout();
        setUser(null);
        setToken(null);
      }
    } finally {
      setTasksLoading(false);
    }
  }, []);

  // Verify token on initial load
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = authService.getStoredToken();
      if (!storedToken) {
        setAuthLoading(false);
        return;
      }

      try {
        const verifiedUser = await authService.getMe();
        setUser(verifiedUser);
        setToken(storedToken);
      } catch {
        authService.logout();
        setUser(null);
        setToken(null);
      } finally {
        setAuthLoading(false);
      }
    };

    verifySession();
  }, []);

  useEffect(() => {
    if (user && token) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user, token, fetchTasks]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setToken(data.token);
    showFeedback(`Welcome back, ${data.user.name}.`, 'success');
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    setToken(data.token);
    showFeedback('Account created. Welcome to TaskFlow.', 'success');
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setTasks([]);
    setGlobalSearch('');
  };

  const createTask = async (taskPayload) => {
    const data = await taskApi.create(taskPayload);
    setTasks((prev) => [data.task, ...prev]);
    showFeedback('Task created successfully.', 'success');
    return data.task;
  };

  const updateTask = async (id, taskPayload) => {
    const data = await taskApi.update(id, taskPayload);
    setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
    showFeedback('Task updated successfully.', 'success');
    return data.task;
  };

  const updateTaskStatus = async (id, status) => {
    const data = await taskApi.updateStatus(id, status);
    setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
    showFeedback(`Task marked as ${status}.`, 'success');
    return data.task;
  };

  const deleteTask = async (id) => {
    await taskApi.remove(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    showFeedback('Task deleted.', 'success');
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authLoading,
        isAuthenticated: Boolean(user && token),
        login,
        register,
        logout,
        tasks,
        tasksLoading,
        tasksError,
        fetchTasks,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        globalSearch,
        setGlobalSearch,
        isTaskModalOpen,
        editingTask,
        openCreateModal,
        openEditModal,
        closeTaskModal,
        feedback,
        setFeedback,
        showFeedback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
