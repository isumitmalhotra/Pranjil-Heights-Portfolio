import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
import Unsubscribe from './pages/Unsubscribe';

// Admin imports
import {
  AuthProvider,
  Login as AdminLogin,
  ForgotPassword as AdminForgotPassword,
  ResetPassword as AdminResetPassword,
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

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function RouteSeoManager() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const origin = window.location.origin;
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    const canonicalUrl = `${origin}${normalizedPath}`;

    const seoByRoute = {
      '/': {
        title: 'Pranijheightsindia - Premium PVC Panels',
        description: 'Leading manufacturer of premium PVC wall panels, ceiling panels, WPC panels and louver panels for modern architecture and interiors.'
      },
      '/products': {
        title: 'Products | Pranijheightsindia PVC Panels',
        description: 'Explore Pranijheightsindia product range including PVC wall panels, UV sheets, fluted panels and WPC louvers.'
      },
      '/compare': {
        title: 'Compare Products | Pranijheightsindia',
        description: 'Compare panel specifications, applications and finishes to choose the right Pranijheightsindia solution for your project.'
      },
      '/resources': {
        title: 'Resources | Catalogues and Technical Information',
        description: 'Download catalogues, brochures and technical resources for Pranijheightsindia PVC and WPC product collections.'
      },
      '/about': {
        title: 'About Us | Pranijheightsindia',
        description: 'Learn about Pranijheightsindia, our manufacturing capabilities, quality standards and pan-India dealer network.'
      },
      '/contact': {
        title: 'Contact Us | Pranijheightsindia',
        description: 'Contact Pranijheightsindia for project quotations, product inquiries and dealer partnership opportunities.'
      },
      '/dealer': {
        title: 'Dealer Partnership | Pranijheightsindia',
        description: 'Join the Pranijheightsindia dealer network and grow with premium PVC panel products and dedicated support.'
      },
      '/unsubscribe': {
        title: 'Email Preferences | Pranijheightsindia',
        description: 'Manage your Pranijheightsindia email communication preferences.'
      }
    };

    const routeSeo = pathname.startsWith('/products/')
      ? {
          title: 'Product Details | Pranijheightsindia',
          description: 'View detailed specifications, features and application information for Pranijheightsindia panel products.'
        }
      : (seoByRoute[normalizedPath] || seoByRoute['/']);

    const upsertMeta = (selector, createAttrs, content) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        Object.entries(createAttrs).forEach(([key, value]) => el.setAttribute(key, value));
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    document.title = routeSeo.title;

    upsertMeta('meta[name="description"]', { name: 'description' }, routeSeo.description);
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, routeSeo.title);
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, routeSeo.description);
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl);
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, routeSeo.title);
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, routeSeo.description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [pathname]);

  return null;
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
        <ScrollToTop />
        <RouteSeoManager />
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
            <Route path="/unsubscribe" element={<Unsubscribe />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={
            <AuthProvider>
              <AdminLogin />
            </AuthProvider>
          } />

          <Route path="/admin/forgot-password" element={
            <AuthProvider>
              <AdminForgotPassword />
            </AuthProvider>
          } />

          <Route path="/admin/reset-password" element={
            <AuthProvider>
              <AdminResetPassword />
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

