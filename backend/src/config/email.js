/* global process */
import nodemailer from 'nodemailer';

// Import email templates
import { 
  contactConfirmationTemplate, 
  contactAdminNotificationTemplate 
} from '../templates/emails/contact.js';
import { 
  quoteConfirmationTemplate, 
  quoteAdminNotificationTemplate 
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
    process.env.SMTP_PASS !== 'your_gmail_app_password_here'
  );
};

// Log email config status on startup
if (!isEmailConfigured()) {
  console.log('⚠️  Email not configured - emails will be logged to console instead');
  console.log('   To enable email, set SMTP_USER and SMTP_PASS in .env with a Gmail App Password');
  console.log('   See: https://support.google.com/accounts/answer/185833');
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
    console.log('📧 [EMAIL NOT SENT - No SMTP configured]');
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
    
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    // Don't throw - email failure shouldn't break the main request
    return { success: false, error: error.message };
  }
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
  const adminEmail = process.env.ADMIN_EMAIL;
  
  return sendEmail({
    to: adminEmail,
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
  const adminEmail = process.env.ADMIN_EMAIL;
  
  return sendEmail({
    to: adminEmail,
    subject: `[Quote Request] ${data.priority === 'urgent' ? '🔴 URGENT' : 'New'} from ${data.name}`,
    html: quoteAdminNotificationTemplate(data),
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
  const adminEmail = process.env.ADMIN_EMAIL;
  
  return sendEmail({
    to: adminEmail,
    subject: `[Dealer Application] New from ${data.companyName}`,
    html: dealerAdminNotificationTemplate(data),
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
    default:
      console.warn(`Unknown notification type: ${type}`);
      return { success: false, error: `Unknown notification type: ${type}` };
  }
};
