const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getAuthToken = () => {
  return localStorage.getItem('taskflow_token');
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      (data && data.message) ||
      `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  return data;
};

// Task CRUD API calls
export const taskApi = {
  // GET /api/tasks
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.status && params.status !== 'All') searchParams.set('status', params.status);
    if (params.priority && params.priority !== 'All') searchParams.set('priority', params.priority);
    if (params.search && params.search.trim()) searchParams.set('search', params.search.trim());
    if (params.sort) searchParams.set('sort', params.sort);

    const queryString = searchParams.toString();
    return await apiRequest(`/tasks${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  // GET /api/tasks/:id
  getById: async (id) => {
    return await apiRequest(`/tasks/${id}`, {
      method: 'GET',
    });
  },

  // POST /api/tasks
  create: async (taskData) => {
    return await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  // PUT /api/tasks/:id
  update: async (id, taskData) => {
    return await apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  // PATCH /api/tasks/:id/status
  updateStatus: async (id, status) => {
    return await apiRequest(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // DELETE /api/tasks/:id
  remove: async (id) => {
    return await apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

export default apiRequest;
