// requestService.js - API calls for garbage requests and waste types
import api from './api';

// ─── Waste Types ─────────────────────────
export const getWasteTypes = async () => {
  const res = await api.get('/waste-types');
  return res.data;
};

// ─── User: Create Request ─────────────────
export const createRequest = async (data) => {
  const res = await api.post('/requests/create', data);
  return res.data;
};

// ─── User: Get own requests ───────────────
export const getUserRequests = async (userId) => {
  const res = await api.get(`/requests/user/${userId}`);
  return res.data;
};

// ─── Admin: Get all requests ──────────────
export const getAllRequests = async () => {
  const res = await api.get('/requests/admin/all');
  return res.data;
};

// ─── Admin: Update request ────────────────
export const updateRequest = async (id, data) => {
  const res = await api.put(`/requests/admin/update/${id}`, data);
  return res.data;
};

// ─── Admin: Stats ─────────────────────────
export const getAdminStats = async () => {
  const res = await api.get('/requests/admin/stats');
  return res.data;
};

// ─── Admin: Users ─────────────────────────
export const getAllUsers = async () => {
  const res = await api.get('/admin/users');
  return res.data;
};

export const toggleUserStatus = async (userId) => {
  const res = await api.put(`/admin/users/${userId}/toggle-status`);
  return res.data;
};
