import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Compare from './pages/Compare';
import Resources from './pages/Resources';
import About from './pages/About';
import Contact from './pages/Contact';
import DealerPortal from './pages/DealerPortal';

// Admin imports
import {
  AuthProvider,
  Login as AdminLogin,
  Dashboard as AdminDashboard,
  Products as AdminProducts,
  Categories as AdminCategories,
  Contacts as AdminContacts,
  Quotes as AdminQuotes,
  Dealers as AdminDealers,
  Testimonials as AdminTestimonials,
  Newsletter as AdminNewsletter,
  Settings as AdminSettings,
  Catalogues as AdminCatalogues,
  MediaLibrary as AdminMediaLibrary,
  AdminLayout,
  ProtectedRoute
} from './admin';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error for debugging (remove console in production or use a service)
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">We apologize for the inconvenience. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 404 Page
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-6xl font-bold text-amber-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">The page you are looking for does not exist or has been moved.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dealer" element={<DealerPortal />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={
            <AuthProvider>
              <AdminLogin />
            </AuthProvider>
          } />
          
          <Route path="/admin" element={
            <AuthProvider>
              <ProtectedRoute />
            </AuthProvider>
          }>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="quotes" element={<AdminQuotes />} />
              <Route path="dealers" element={<AdminDealers />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
              <Route path="catalogues" element={<AdminCatalogues />} />
              <Route path="media" element={<AdminMediaLibrary />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
            borderRadius: '8px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#D4AF37',
              secondary: '#1F2937',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#1F2937',
            },
          },
        }}
      />
    </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

