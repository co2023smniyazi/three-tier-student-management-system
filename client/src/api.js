// Base API URL normalization:
// Automatically ensures the path ends with '/api' whether VITE_API_BASE_URL is set as:
// - https://<host>
// - https://<host>/api
// - https://<host>/api/
// - or omitted (defaults to '/api')
const rawBase = (import.meta.env.VITE_API_BASE_URL || '/api').trim().replace(/\/+$/, '');
const API_BASE = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  let data = {};

  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => ({}));
  }

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  checkHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },

  getAllStudents: async (search = '') => {
    const url = search ? `${API_BASE}/students?search=${encodeURIComponent(search)}` : `${API_BASE}/students`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  getStudentById: async (id) => {
    const res = await fetch(`${API_BASE}/students/${encodeURIComponent(id)}`);
    return handleResponse(res);
  },

  createStudent: async (studentData) => {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    return handleResponse(res);
  },

  updateStudent: async (id, studentData) => {
    const res = await fetch(`${API_BASE}/students/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    return handleResponse(res);
  },

  deleteStudent: async (id) => {
    const res = await fetch(`${API_BASE}/students/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },
};
