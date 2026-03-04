import express from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';
import contactRoutes from './contact.routes.js';
import quoteRoutes from './quote.routes.js';
import dealerRoutes from './dealer.routes.js';
import newsletterRoutes from './newsletter.routes.js';
import testimonialRoutes from './testimonial.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import catalogueRoutes from './catalogue.routes.js';
import settingsRoutes from './settings.routes.js';
import userRoutes from './user.routes.js';
import uploadRoutes from './upload.routes.js';

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/contact', contactRoutes);
router.use('/quotes', quoteRoutes);
router.use('/dealers', dealerRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/catalogues', catalogueRoutes);
router.use('/settings', settingsRoutes);
router.use('/upload', uploadRoutes);

export default router;
