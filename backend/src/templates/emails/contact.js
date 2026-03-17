/**
 * Email Templates - Contact Form
 * Templates for contact form submissions
 */

import { baseTemplate, createButton, createInfoTable, createBadge, COLORS, COMPANY } from './base.js';

/**
 * Contact Form - User Confirmation Email
 */
export const contactConfirmationTemplate = (data) => {
  const { name, email, subject, message, referenceId } = data;
  
  const content = `
    <!-- Greeting -->
    <h2 style="margin: 0 0 20px; color: ${COLORS.textPrimary}; font-size: 24px;">
      Thank You for Reaching Out! 🙏
    </h2>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      Dear <strong>${name}</strong>,
    </p>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      Thank you for contacting ${COMPANY.name}. We have received your message and our team will review it promptly. You can expect a response within <strong>24-48 business hours</strong>.
    </p>
    
    <!-- Reference Number -->
    ${referenceId ? `
    <div style="background-color: #f9f9f9; border-left: 4px solid ${COLORS.primary}; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; color: ${COLORS.textSecondary}; font-size: 14px;">Your Reference Number:</p>
      <p style="margin: 8px 0 0; color: ${COLORS.textPrimary}; font-size: 20px; font-weight: 600;">${referenceId}</p>
    </div>
    ` : ''}
    
    <!-- Message Summary -->
    <div style="background-color: #fafafa; border: 1px solid ${COLORS.border}; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 16px; color: ${COLORS.textPrimary}; font-size: 16px; font-weight: 600;">
        Your Message Summary:
      </h3>
      ${createInfoTable([
        ['Subject', subject || 'General Inquiry'],
        ['Email', email],
      ])}
      <div style="margin-top: 16px;">
        <strong style="color: ${COLORS.textSecondary}; font-size: 14px;">Message:</strong>
        <p style="margin: 8px 0 0; padding: 12px; background-color: #ffffff; border: 1px solid ${COLORS.border}; border-radius: 4px; color: ${COLORS.textPrimary}; font-size: 14px; line-height: 1.6;">
          ${message ? message.replace(/\n/g, '<br>') : 'No message provided'}
        </p>
      </div>
    </div>
    
    <!-- What's Next -->
    <h3 style="margin: 24px 0 16px; color: ${COLORS.textPrimary}; font-size: 18px;">
      What Happens Next?
    </h3>
    <ul style="margin: 0; padding-left: 20px; color: ${COLORS.textSecondary}; font-size: 15px; line-height: 1.8;">
      <li>Our team will review your inquiry</li>
      <li>A dedicated representative will be assigned to your request</li>
      <li>You'll receive a detailed response within 24-48 hours</li>
    </ul>
    
    <!-- CTA -->
    <div style="text-align: center; margin: 32px 0;">
      ${createButton('View Our Products', `${COMPANY.website}/products`)}
    </div>
    
    <!-- Note -->
    <p style="margin: 24px 0 0; padding-top: 20px; border-top: 1px solid ${COLORS.border}; color: ${COLORS.textLight}; font-size: 13px; line-height: 1.6;">
      If you have any urgent queries, feel free to call us at <a href="tel:${COMPANY.phone.replace(/\s/g, '')}" style="color: ${COLORS.primary};">${COMPANY.phone}</a>.
    </p>
  `;
  
  return baseTemplate(content, {
    preheader: `Thank you for contacting ${COMPANY.name}. We'll respond within 24-48 hours.`
  });
};

/**
 * Contact Form - Admin Notification Email
 */
export const contactAdminNotificationTemplate = (data) => {
  const { id, name, email, phone, company, subject, message, ipAddress, userAgent, createdAt } = data;
  
  const content = `
    <!-- Alert Header -->
    <div style="text-align: center; margin-bottom: 24px;">
      ${createBadge('NEW CONTACT INQUIRY', 'warning')}
    </div>
    
    <h2 style="margin: 0 0 8px; color: ${COLORS.textPrimary}; font-size: 22px; text-align: center;">
      New Message from ${name}
    </h2>
    <p style="margin: 0 0 24px; color: ${COLORS.textSecondary}; font-size: 14px; text-align: center;">
      Received on ${new Date(createdAt || Date.now()).toLocaleString('en-IN', { 
        dateStyle: 'full', 
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      })}
    </p>
    
    <!-- Contact Details -->
    <div style="background-color: #fafafa; border: 1px solid ${COLORS.border}; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 16px; color: ${COLORS.primary}; font-size: 16px; font-weight: 600;">
        📋 Contact Details
      </h3>
      ${createInfoTable([
        ['Name', name],
        ['Email', `<a href="mailto:${email}" style="color: ${COLORS.primary};">${email}</a>`],
        ['Phone', phone ? `<a href="tel:${phone}" style="color: ${COLORS.primary};">${phone}</a>` : 'Not provided'],
        ['Company', company || 'Not provided'],
        ['Subject', subject || 'General Inquiry'],
      ])}
    </div>
    
    <!-- Message -->
    <div style="background-color: #fff9e6; border: 1px solid ${COLORS.primary}; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 12px; color: ${COLORS.textPrimary}; font-size: 16px; font-weight: 600;">
        💬 Message
      </h3>
      <p style="margin: 0; color: ${COLORS.textPrimary}; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">
        ${message || 'No message content'}
      </p>
    </div>
    
    <!-- Technical Details -->
    <details style="margin: 20px 0; font-size: 13px; color: ${COLORS.textLight};">
      <summary style="cursor: pointer; padding: 8px 0;">Technical Details</summary>
      <div style="padding: 12px; background-color: #f5f5f5; border-radius: 4px; margin-top: 8px;">
        <p style="margin: 4px 0;">ID: ${id || 'N/A'}</p>
        <p style="margin: 4px 0;">IP: ${ipAddress || 'N/A'}</p>
        <p style="margin: 4px 0;">User Agent: ${userAgent || 'N/A'}</p>
      </div>
    </details>
    
    <!-- Action Buttons -->
    <div style="text-align: center; margin: 32px 0;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
        <tr>
          <td style="padding-right: 12px;">
            ${createButton('Reply to Customer', `mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Your Inquiry to Pranijheightsindia')}`)}
          </td>
          <td>
            ${createButton('View in Admin', `${COMPANY.website}/admin/contacts/${id || ''}`, 'secondary')}
          </td>
        </tr>
      </table>
    </div>
  `;
  
  return baseTemplate(content, {
    preheader: `New contact inquiry from ${name} - ${subject || 'General Inquiry'}`,
    showSocial: false
  });
};

export const contactTemplates = {
  confirmation: contactConfirmationTemplate,
  adminNotification: contactAdminNotificationTemplate,
};
