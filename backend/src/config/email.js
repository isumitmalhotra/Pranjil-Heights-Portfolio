/* global process */
import nodemailer from 'nodemailer';

// Import email templates
import { 
  contactConfirmationTemplate, 
  contactAdminNotificationTemplate 
} from '../templates/emails/contact.js';
import { 
  quoteConfirmationTemplate, 
  quoteAdminNotificationTemplate,
  quoteReadyTemplate,
} from '../templates/emails/quote.js';
import { 
  dealerConfirmationTemplate, 
  dealerAdminNotificationTemplate,
  dealerStatusUpdateTemplate 
} from '../templates/emails/dealer.js';
import { 
  newsletterWelcomeTemplate,
  newsletterUnsubscribeTemplate 
} from '../templates/emails/newsletter.js';
import { 
  passwordResetTemplate,
  passwordResetSuccessTemplate,
  adminAccountCreatedTemplate,
  loginAlertTemplate 
} from '../templates/emails/auth.js';
import { COMPANY } from '../templates/emails/base.js';

// Check if email is configured
const isEmailConfigured = () => {
  return (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.SMTP_PASS !== 'your-smtp-password'
  );
};

const getNotificationRecipients = () => {
  const rawRecipients = process.env.NOTIFICATION_EMAILS || process.env.ADMIN_EMAIL || '';
  const recipients = rawRecipients
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);

  return recipients;
};

// Log email config status on startup
if (!isEmailConfigured()) {
  console.log('Email not configured - emails will be logged to console instead');
  console.log('To enable email, set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env');
}

// Create transporter
const createTransporter = () => {
  if (!isEmailConfigured()) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send email using configured SMTP
 * Falls back to console logging if email is not configured
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  // If email not configured, log to console instead
  if (!transporter) {
    console.log('[EMAIL NOT SENT - No SMTP configured]');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   (Email would be sent in production with valid SMTP credentials)`);
    return { success: true, messageId: 'dev-mode-no-email', simulated: true };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"${COMPANY.name}" <noreply@pranijheightsindia.com>`,
      to,
      subject,
      text: text || subject, // Fallback text
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error.message);
    // Don't throw - email failure shouldn't break the main request
    return { success: false, error: error.message };
  }
};

const sendAdminEmail = async ({ subject, html, text }) => {
  const recipients = getNotificationRecipients();

  if (!recipients.length) {
    console.warn('No admin notification recipients configured (set NOTIFICATION_EMAILS or ADMIN_EMAIL)');
    return { success: false, error: 'No recipients configured' };
  }

  return sendEmail({
    to: recipients,
    subject,
    html,
    text,
  });
};

/**
 * ===================================
 * CONTACT FORM EMAILS
 * ===================================
 */

// Contact Form Confirmation Email (to user)
export const sendContactConfirmation = async (data) => {
  const { email, referenceNumber } = data;
  
  return sendEmail({
    to: email,
    subject: `Thank you for contacting ${COMPANY.name} [Ref: ${referenceNumber || 'N/A'}]`,
    html: contactConfirmationTemplate(data),
  });
};

// Contact Form Admin Notification
export const sendContactAdminNotification = async (data) => {
  return sendAdminEmail({
    subject: `[Website] New Contact Inquiry from ${data.name}`,
    html: contactAdminNotificationTemplate(data),
  });
};

/**
 * ===================================
 * QUOTE REQUEST EMAILS
 * ===================================
 */

// Quote Request Confirmation (to user)
export const sendQuoteConfirmation = async (data) => {
  const { email, referenceNumber } = data;
  
  return sendEmail({
    to: email,
    subject: `Quote Request Received [Ref: ${referenceNumber}] - ${COMPANY.name}`,
    html: quoteConfirmationTemplate(data),
  });
};

// Quote Request Admin Notification
export const sendQuoteAdminNotification = async (data) => {
  return sendAdminEmail({
    subject: `[Quote Request] ${data.priority === 'urgent' ? '🔴 URGENT' : 'New'} from ${data.name}`,
    html: quoteAdminNotificationTemplate(data),
  });
};

// Quote Ready Notification (to user)
export const sendQuoteReady = async (data) => {
  const { email, referenceNumber } = data;

  return sendEmail({
    to: email,
    subject: `Your Quote is Ready - ${referenceNumber}`,
    html: quoteReadyTemplate(data),
  });
};

/**
 * ===================================
 * DEALER APPLICATION EMAILS
 * ===================================
 */

// Dealer Application Confirmation (to applicant)
export const sendDealerConfirmation = async (data) => {
  const { email, applicationId } = data;
  
  return sendEmail({
    to: email,
    subject: `Dealer Application Received [${applicationId}] - ${COMPANY.name}`,
    html: dealerConfirmationTemplate(data),
  });
};

// Dealer Application Admin Notification
export const sendDealerAdminNotification = async (data) => {
  return sendAdminEmail({
    subject: `[Dealer Application] New from ${data.companyName}`,
    html: dealerAdminNotificationTemplate(data),
  });
};

// Newsletter Admin Notification
export const sendNewsletterAdminNotification = async (data) => {
  const { email, name, source } = data;

  return sendAdminEmail({
    subject: `[Newsletter] New subscription from ${email}`,
    html: `
      <h2>New Newsletter Subscription</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Name:</strong> ${name || 'Not provided'}</p>
      <p><strong>Source:</strong> ${source || 'website'}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    `,
    text: `New Newsletter Subscription\nEmail: ${email}\nName: ${name || 'Not provided'}\nSource: ${source || 'website'}`,
  });
};

// Catalogue Lead Admin Notification
export const sendCatalogueLeadAdminNotification = async (data) => {
  const { catalogueName, name, email, phone, company, source } = data;

  return sendAdminEmail({
    subject: `[Catalogue Lead] ${catalogueName} requested by ${name || email || 'Visitor'}`,
    html: `
      <h2>New Catalogue Lead</h2>
      <p><strong>Catalogue:</strong> ${catalogueName}</p>
      <p><strong>Name:</strong> ${name || 'Not provided'}</p>
      <p><strong>Email:</strong> ${email || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Company:</strong> ${company || 'Not provided'}</p>
      <p><strong>Source:</strong> ${source || 'website'}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    `,
    text: `New Catalogue Lead\nCatalogue: ${catalogueName}\nName: ${name || 'Not provided'}\nEmail: ${email || 'Not provided'}\nPhone: ${phone || 'Not provided'}\nCompany: ${company || 'Not provided'}\nSource: ${source || 'website'}`,
  });
};

// Dealer Status Update (to applicant)
export const sendDealerStatusUpdate = async (data) => {
  const { email, status } = data;
  
  const statusSubjects = {
    APPROVED: `🎉 Congratulations! Your Dealer Application is Approved`,
    REJECTED: `Dealer Application Update - ${COMPANY.name}`,
    UNDER_REVIEW: `Your Dealer Application is Under Review - ${COMPANY.name}`,
  };
  
  return sendEmail({
    to: email,
    subject: statusSubjects[status] || `Dealer Application Update - ${COMPANY.name}`,
    html: dealerStatusUpdateTemplate(data),
  });
};

/**
 * ===================================
 * NEWSLETTER EMAILS
 * ===================================
 */

// Newsletter Welcome Email
export const sendNewsletterWelcome = async (email, name = null) => {
  return sendEmail({
    to: email,
    subject: `Welcome to ${COMPANY.name} Newsletter! 🎉`,
    html: newsletterWelcomeTemplate({ email, name }),
  });
};

// Newsletter Unsubscribe Confirmation
export const sendNewsletterUnsubscribe = async (email) => {
  return sendEmail({
    to: email,
    subject: `You've been unsubscribed - ${COMPANY.name}`,
    html: newsletterUnsubscribeTemplate({ email }),
  });
};

/**
 * ===================================
 * AUTHENTICATION EMAILS
 * ===================================
 */

// Password Reset Request
export const sendPasswordReset = async (data) => {
  const { email } = data;
  
  return sendEmail({
    to: email,
    subject: `Password Reset Request - ${COMPANY.name} Admin`,
    html: passwordResetTemplate(data),
  });
};

// Password Reset Success
export const sendPasswordResetSuccess = async (data) => {
  const { email } = data;
  
  return sendEmail({
    to: email,
    subject: `Password Changed Successfully - ${COMPANY.name}`,
    html: passwordResetSuccessTemplate(data),
  });
};

// Admin Account Created
export const sendAdminAccountCreated = async (data) => {
  const { email } = data;
  
  return sendEmail({
    to: email,
    subject: `Your ${COMPANY.name} Admin Account is Ready`,
    html: adminAccountCreatedTemplate(data),
  });
};

// Login Alert
export const sendLoginAlert = async (data) => {
  const { email } = data;
  
  return sendEmail({
    to: email,
    subject: `New Login to Your ${COMPANY.name} Account`,
    html: loginAlertTemplate(data),
  });
};

/**
 * ===================================
 * LEGACY ADMIN NOTIFICATION (for backward compatibility)
 * ===================================
 */
export const sendAdminNotification = async (type, data) => {
  switch (type) {
    case 'contact':
      return sendContactAdminNotification(data);
    case 'quote':
      return sendQuoteAdminNotification(data);
    case 'dealer':
      return sendDealerAdminNotification(data);
    case 'newsletter':
      return sendNewsletterAdminNotification(data);
    case 'catalogue':
      return sendCatalogueLeadAdminNotification(data);
    default:
      console.warn(`Unknown notification type: ${type}`);
      return { success: false, error: `Unknown notification type: ${type}` };
  }
};
