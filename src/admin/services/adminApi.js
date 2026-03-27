import axios from 'axios';

const ADMIN_API_TIMEOUT_MS = 60000;
const ADMIN_UPLOAD_TIMEOUT_MS = 600000;

const resolveAdminApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) return envUrl.replace(/\/+$/, '');
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:5000/api';
};

// Create admin axios instance
const adminApi = axios.create({
  baseURL: resolveAdminApiBaseUrl(),
  timeout: ADMIN_API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
adminApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const isTimeout = error?.code === 'ECONNABORTED' || String(error?.message || '').toLowerCase().includes('timeout');
    const message = isTimeout
      ? 'Upload timed out. Please try a smaller file or retry with a stable connection.'
      : (error.response?.data?.message || error.message || 'Something went wrong');
    
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    
    return Promise.reject({ message, status: error.response?.status });
  }
);

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  login: (credentials) => adminApi.post('/auth/login', credentials),
  logout: () => adminApi.post('/auth/logout'),
  getMe: () => adminApi.get('/auth/me'),
  forgotPassword: (email) => adminApi.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => adminApi.post(`/auth/reset-password/${token}`, { password }),
  changePassword: (data) => adminApi.put('/auth/change-password', data),
  updateProfile: (data) => adminApi.put('/auth/profile', data),
  register: (data) => adminApi.post('/auth/register', data),
};

// ============================================
// USERS API (Admin User Management)
// ============================================
export const usersAPI = {
  getAll: (params = {}) => adminApi.get('/users', { params }),
  getById: (id) => adminApi.get(`/users/${id}`),
  update: (id, data) => adminApi.put(`/users/${id}`, data),
  delete: (id) => adminApi.delete(`/users/${id}`),
  toggleStatus: (id) => adminApi.patch(`/users/${id}/status`),
  resetPassword: (id, newPassword) => adminApi.post(`/users/${id}/reset-password`, { newPassword }),
  getStats: () => adminApi.get('/users/stats'),
};

// ============================================
// DASHBOARD API
// ============================================
export const dashboardAPI = {
  getStats: () => adminApi.get('/dashboard/stats'),
  getRecentActivity: () => adminApi.get('/dashboard/activity'),
};

// ============================================
// PRODUCTS API (Admin)
// ============================================
export const productsAPI = {
  getAll: (params = {}) => adminApi.get('/products', { params }),
  getById: (id) => adminApi.get(`/products/${id}`),
  create: (data) => adminApi.post('/products', data),
  update: (id, data) => adminApi.put(`/products/${id}`, data),
  delete: (id) => adminApi.delete(`/products/${id}`),
};

// ============================================
// CATEGORIES API (Admin)
// ============================================
export const categoriesAPI = {
  getAll: () => adminApi.get('/categories'),
  getById: (id) => adminApi.get(`/categories/${id}`),
  create: (data) => adminApi.post('/categories', data),
  update: (id, data) => adminApi.put(`/categories/${id}`, data),
  delete: (id) => adminApi.delete(`/categories/${id}`),
};

// ============================================
// CONTACTS API (Admin)
// ============================================
export const contactsAPI = {
  getAll: (params = {}) => adminApi.get('/contact', { params }),
  getById: (id) => adminApi.get(`/contact/${id}`),
  updateStatus: (id, status, notes) => adminApi.put(`/contact/${id}/status`, { status, notes }),
  delete: (id) => adminApi.delete(`/contact/${id}`),
  export: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const baseUrl = adminApi.defaults.baseURL;
    const token = localStorage.getItem('adminToken');
    return `${baseUrl}/contact/export?${queryString}&token=${token}`;
  },
};

// ============================================
// QUOTES API (Admin)
// ============================================
export const quotesAPI = {
  getAll: (params = {}) => adminApi.get('/quotes', { params }),
  getById: (id) => adminApi.get(`/quotes/${id}`),
  updateStatus: (id, data) => adminApi.put(`/quotes/${id}/status`, data),
  delete: (id) => adminApi.delete(`/quotes/${id}`),
  export: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const baseUrl = adminApi.defaults.baseURL;
    const token = localStorage.getItem('adminToken');
    return `${baseUrl}/quotes/export?${queryString}&token=${token}`;
  },
};

// ============================================
// DEALER APPLICATIONS API (Admin)
// ============================================
export const dealersAPI = {
  getAll: (params = {}) => adminApi.get('/dealers', { params }),
  getById: (id) => adminApi.get(`/dealers/${id}`),
  updateStatus: (id, status, notes) => adminApi.patch(`/dealers/${id}/status`, { status, notes }),
  delete: (id) => adminApi.delete(`/dealers/${id}`),
  export: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const baseUrl = adminApi.defaults.baseURL;
    const token = localStorage.getItem('adminToken');
    return `${baseUrl}/dealers/export?${queryString}&token=${token}`;
  },
};

// ============================================
// TESTIMONIALS API (Admin)
// ============================================
export const testimonialsAPI = {
  getAll: (params = {}) => adminApi.get('/testimonials/all', { params }),
  getById: (id) => adminApi.get(`/testimonials/${id}`),
  create: (data) => adminApi.post('/testimonials', data),
  update: (id, data) => adminApi.put(`/testimonials/${id}`, data),
  delete: (id) => adminApi.delete(`/testimonials/${id}`),
};

// ============================================
// NEWSLETTER API (Admin)
// ============================================
export const newsletterAPI = {
  getAll: (params = {}) => adminApi.get('/newsletter/subscribers', { params }),
  getSubscribers: (params = {}) => adminApi.get('/newsletter/subscribers', { params }),
  delete: (id) => adminApi.delete(`/newsletter/${id}`),
  exportSubscribers: () => adminApi.get('/newsletter/export'),
};

// ============================================
// CATALOGUES API (Admin)
// ============================================
export const cataloguesAPI = {
  getAll: (params = {}) => adminApi.get('/catalogues/admin/all', { params }),
  getById: (id) => adminApi.get(`/catalogues/admin/${id}`),
  create: (data) => adminApi.post('/catalogues/admin', data),
  update: (id, data) => adminApi.put(`/catalogues/admin/${id}`, data),
  delete: (id) => adminApi.delete(`/catalogues/admin/${id}`),
  getStats: (period = 30) => adminApi.get('/catalogues/admin/stats', { params: { period } }),
  getDownloads: (params = {}) => adminApi.get('/catalogues/admin/downloads', { params }),
  exportDownloads: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const baseUrl = adminApi.defaults.baseURL;
    const token = localStorage.getItem('adminToken');
    // Return URL for direct download
    return `${baseUrl}/catalogues/admin/downloads/export?${queryString}&token=${token}`;
  },
};

// ============================================
// SETTINGS API (Admin)
// ============================================
export const settingsAPI = {
  // Site settings
  getAll: (group) => adminApi.get('/settings', { params: group ? { group } : {} }),
  getByGroup: (group) => adminApi.get(`/settings/group/${group}`),
  getByKey: (key) => adminApi.get(`/settings/key/${key}`),
  update: (key, data) => adminApi.put(`/settings/${key}`, data),
  bulkUpdate: (settings) => adminApi.put('/settings/bulk', { settings }),
  delete: (key) => adminApi.delete(`/settings/${key}`),
  
  // Notification preferences
  getNotificationPreferences: () => adminApi.get('/settings/notifications/preferences'),
  updateNotificationPreferences: (preferences) => adminApi.put('/settings/notifications/preferences', { preferences }),
  
  // System info
  getSystemInfo: () => adminApi.get('/settings/system/info'),
};

// ============================================
// UPLOAD / MEDIA API (Admin)
// ============================================
export const uploadAPI = {
  // Upload single file
  upload: (file, folder = 'general', alt = '') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (alt) formData.append('alt', alt);
    return adminApi.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: ADMIN_UPLOAD_TIMEOUT_MS,
    });
  },

  // Upload multiple files
  uploadMultiple: (files, folder = 'general') => {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    formData.append('folder', folder);
    return adminApi.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: ADMIN_UPLOAD_TIMEOUT_MS,
    });
  },

  // Upload product image (generates thumbnail)
  uploadProductImage: (file, alt = '') => {
    const formData = new FormData();
    formData.append('image', file);
    if (alt) formData.append('alt', alt);
    return adminApi.post('/upload/product-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: ADMIN_UPLOAD_TIMEOUT_MS,
    });
  },

  // Upload category image
  uploadCategoryImage: (file, alt = '') => {
    const formData = new FormData();
    formData.append('image', file);
    if (alt) formData.append('alt', alt);
    return adminApi.post('/upload/category-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: ADMIN_UPLOAD_TIMEOUT_MS,
    });
  },

  // Upload catalogue PDF + optional thumbnail
  uploadCatalogue: (pdfFile, thumbnailFile = null) => {
    const formData = new FormData();
    formData.append('file', pdfFile);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
    return adminApi.post('/upload/catalogue', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: ADMIN_UPLOAD_TIMEOUT_MS,
    });
  },

  // Upload testimonial image
  uploadTestimonialImage: (file, alt = '') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'testimonials');
    if (alt) formData.append('alt', alt);
    return adminApi.post('/upload/testimonial-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: ADMIN_UPLOAD_TIMEOUT_MS,
    });
  },

  // Get media library (paginated)
  getMedia: (params = {}) => adminApi.get('/upload/media', { params }),

  // Get storage stats
  getStats: () => adminApi.get('/upload/stats'),

  // Delete a media file
  delete: (id) => adminApi.delete(`/upload/${id}`),
};

export default adminApi;
