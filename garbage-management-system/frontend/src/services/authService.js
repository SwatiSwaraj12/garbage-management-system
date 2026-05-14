 // authService.js - Login, register, logout, and local storage helpers
import api from './api';

// ================= REGISTER =================
export const register = async (data) => {
  try {
    const res = await api.post('/auth/register', data);
    return res.data;
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, message: "Register failed" };
  }
};

// ================= LOGIN =================
export const login = async (email, password) => {
  console.log("STEP 3: API call start", email, password);
  try {
    const res = await api.post('/auth/login', { email, password });

    if (res.data.success) {
      // ✅ store only available fields
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('role', res.data.role);

      // optional (if backend sends later)
      if (res.data.email) {
        localStorage.setItem('email', res.data.email);
      }
      if (res.data.userId) {
        localStorage.setItem('userId', res.data.userId);
      }
    }

    return res.data;

  } catch (error) {
    console.error("Login error:", error);

    return {
      success: false,
      message: "Login failed (check backend)"
    };
  }
};

// ================= LOGOUT =================
export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};

// ================= GET USER =================
export const getUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  return {
    token,
    name: localStorage.getItem('name'),
    role: localStorage.getItem('role'),
    email: localStorage.getItem('email'),
    userId: localStorage.getItem('userId'),
  };
};

// ================= CHECK ADMIN =================
export const isAdmin = () => {
  return localStorage.getItem('role') === 'ADMIN';
};