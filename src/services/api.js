import axios from 'axios';

const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) return envUrl.replace(/\/+$/, '');
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:5000/api';
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    
    // Handle specific error codes
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      // Optionally redirect to login
    }
    
    return Promise.reject({ message, status: error.response?.status });
  }
);

// ============================================
// PRODUCTS API
// ============================================
export const productAPI = {
  // Get all products with pagination and filters
  getAll: (params = {}) => api.get('/products', { params }),
  
  // Get single product by ID or slug
  getById: (id) => api.get(`/products/${id}`),
  
  // Get products by category slug
  getByCategory: (slug, params = {}) => api.get(`/products/category/${slug}`, { params }),
  
  // Get featured products
  getFeatured: () => api.get('/products/featured'),
  
  // Search products
  search: (query) => api.get('/products/search', { params: { q: query } }),
};

// ============================================
// CATEGORIES API
// ============================================
export const categoryAPI = {
  // Get all categories
  getAll: () => api.get('/categories'),
  
  // Get single category by slug
  getBySlug: (slug) => api.get(`/categories/${slug}`),
};

// ============================================
// CONTACT API
// ============================================
export const contactAPI = {
  // Submit contact form
  submit: (data) => api.post('/contact', data),
};

// ============================================
// QUOTE API
// ============================================
export const quoteAPI = {
  // Submit quote request
  submit: (data) => api.post('/quotes', data),
};

// ============================================
// DEALER API
// ============================================
export const dealerAPI = {
  // Submit dealer application
  apply: (data) => api.post('/dealers/apply', data),
};

// ============================================
// NEWSLETTER API
// ============================================
export const newsletterAPI = {
  // Subscribe to newsletter
  subscribe: (data) => api.post('/newsletter/subscribe', data),
  
  // Unsubscribe from newsletter
  unsubscribe: (email) => api.post('/newsletter/unsubscribe', { email }),
};

// ============================================
// TESTIMONIALS API
// ============================================
export const testimonialAPI = {
  // Get all active testimonials
  getAll: () => api.get('/testimonials'),
};

// ============================================
// CATALOGUES API
// ============================================
export const catalogueAPI = {
  // Get all active catalogues
  getAll: (params = {}) => api.get('/catalogues', { params }),
  
  // Get catalogue by slug
  getBySlug: (slug) => api.get(`/catalogues/${slug}`),
  
  // Track download with user info (for download forms)
  download: (slug, data = {}) => api.post(`/catalogues/${slug}/download`, data),
  
  // Get direct download URL (tracks anonymously)
  getDownloadUrl: (slug, source = 'website') => 
    `${api.defaults.baseURL}/catalogues/${slug}/download?source=${source}`,
};

// ============================================
// HOMEPAGE VIDEOS API
// ============================================
export const homeVideosAPI = {
  // Get public latest homepage videos
  getLatest: () => api.get('/settings/public/home-videos'),
};

// ============================================
// AUTH API (for admin)
// ============================================
export const authAPI = {
  // Login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Logout
  logout: () => api.post('/auth/logout'),
  
  // Get current user
  getMe: () => api.get('/auth/me'),
  
  // Change password
  changePassword: (data) => api.put('/auth/change-password', data),
};

export default api;
