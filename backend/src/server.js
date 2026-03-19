/* global process */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL: ${envVar} environment variable is not set`);
    process.exit(1);
  }
}

// Process-level error handlers
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  process.exit(1);
});

// Import routes
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import contactRoutes from './routes/contact.routes.js';
import quoteRoutes from './routes/quote.routes.js';
import dealerRoutes from './routes/dealer.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';
import testimonialRoutes from './routes/testimonial.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import catalogueRoutes from './routes/catalogue.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import userRoutes from './routes/user.routes.js';
import uploadRoutes from './routes/upload.routes.js';

// Import middleware
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { UPLOAD_BASE, LEGACY_UPLOAD_BASE } from './middleware/upload.middleware.js';
import prisma from './config/database.js';

// Initialize Express app
const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({
  origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie Parser
app.use(cookieParser());

// Compression
app.use(compression());

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOAD_BASE, {
  maxAge: '7d',
  etag: true,
  lastModified: true,
}));

// Backward compatibility: also serve legacy backend/uploads if different from current base.
if (LEGACY_UPLOAD_BASE !== UPLOAD_BASE) {
  app.use('/uploads', express.static(LEGACY_UPLOAD_BASE, {
    maxAge: '7d',
    etag: true,
    lastModified: true,
  }));
}

// Also serve uploads under /api/uploads for deployments where only /api is proxied.
app.use('/api/uploads', express.static(UPLOAD_BASE, {
  maxAge: '7d',
  etag: true,
  lastModified: true,
}));

if (LEGACY_UPLOAD_BASE !== UPLOAD_BASE) {
  app.use('/api/uploads', express.static(LEGACY_UPLOAD_BASE, {
    maxAge: '7d',
    etag: true,
    lastModified: true,
  }));
}

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: 'Server is running',
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  } catch {
    res.status(503).json({
      success: false,
      message: 'Server is running but database is unavailable',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/dealers', dealerRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/catalogues', catalogueRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Pranijheightsindia - Backend API Server',
    version: '1.0.0',
    documentation: '/api',
    health: '/health'
  });
});

// API Root
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Pranijheightsindia API v1.0',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      contact: '/api/contact',
      quotes: '/api/quotes',
      dealers: '/api/dealers',
      newsletter: '/api/newsletter',
      testimonials: '/api/testimonials',
      dashboard: '/api/dashboard'
    }
  });
});

// Favicon handler (browsers request this automatically)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content
});

// 404 Handler
app.use(notFound);

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════╗
  ║                                                    ║
  ║   🚀 Pranijheightsindia API Server                    ║
  ║                                                    ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                       ║
  ║   Port: ${PORT}                                        ║
  ║   URL: http://localhost:${PORT}                        ║
  ║                                                    ║
  ╚════════════════════════════════════════════════════╝
  `);
});

export default app;
