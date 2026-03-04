/**
 * Email Templates Index
 * Central export for all email templates
 */

// Base template utilities
export { 
  baseTemplate, 
  createButton, 
  createInfoTable, 
  createBadge,
  COLORS, 
  COMPANY 
} from './base.js';

// Contact form templates
export { 
  contactConfirmationTemplate, 
  contactAdminNotificationTemplate,
  contactTemplates 
} from './contact.js';

// Quote request templates
export { 
  quoteConfirmationTemplate, 
  quoteAdminNotificationTemplate,
  quoteTemplates 
} from './quote.js';

// Dealer application templates
export { 
  dealerConfirmationTemplate, 
  dealerAdminNotificationTemplate,
  dealerStatusUpdateTemplate,
  dealerTemplates 
} from './dealer.js';

// Newsletter templates
export { 
  newsletterWelcomeTemplate, 
  newsletterUnsubscribeTemplate,
  newsletterTemplates 
} from './newsletter.js';

// Authentication templates
export { 
  passwordResetTemplate, 
  passwordResetSuccessTemplate,
  adminAccountCreatedTemplate,
  loginAlertTemplate,
  authTemplates 
} from './auth.js';

// All templates grouped by category
export const allTemplates = {
  contact: {
    confirmation: 'contactConfirmationTemplate',
    adminNotification: 'contactAdminNotificationTemplate',
  },
  quote: {
    confirmation: 'quoteConfirmationTemplate',
    adminNotification: 'quoteAdminNotificationTemplate',
  },
  dealer: {
    confirmation: 'dealerConfirmationTemplate',
    adminNotification: 'dealerAdminNotificationTemplate',
    statusUpdate: 'dealerStatusUpdateTemplate',
  },
  newsletter: {
    welcome: 'newsletterWelcomeTemplate',
    unsubscribe: 'newsletterUnsubscribeTemplate',
  },
  auth: {
    passwordReset: 'passwordResetTemplate',
    passwordResetSuccess: 'passwordResetSuccessTemplate',
    accountCreated: 'adminAccountCreatedTemplate',
    loginAlert: 'loginAlertTemplate',
  },
};
