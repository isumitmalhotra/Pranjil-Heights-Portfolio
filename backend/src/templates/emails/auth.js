/**
 * Email Templates - Authentication
 * Templates for password reset, account verification, etc.
 */

import { baseTemplate, createButton, createInfoTable, COLORS, COMPANY } from './base.js';

/**
 * Password Reset Request
 */
export const passwordResetTemplate = (data) => {
  const { name, email, resetLink, expiresIn = '1 hour' } = data;
  const displayName = name || 'User';
  
  const content = `
    <!-- Security Icon -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 80px; height: 80px; border-radius: 50%; background-color: #fff3cd; line-height: 80px;">
        <span style="font-size: 40px;">🔐</span>
      </div>
    </div>
    
    <h2 style="margin: 0 0 16px; color: ${COLORS.textPrimary}; font-size: 24px; font-weight: 700; text-align: center;">
      Password Reset Request
    </h2>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      Hi <strong>${displayName}</strong>,
    </p>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      We received a request to reset the password for your ${COMPANY.name} admin account associated with <strong>${email}</strong>.
    </p>
    
    <!-- Reset Button -->
    <div style="text-align: center; margin: 32px 0;">
      ${createButton('Reset Password', resetLink)}
    </div>
    
    <!-- Expiry Notice -->
    <div style="background-color: #fff3cd; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        ⏰ This link will expire in <strong>${expiresIn}</strong>.
      </p>
    </div>
    
    <!-- Security Notice -->
    <div style="border: 1px solid ${COLORS.border}; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 12px; color: ${COLORS.textPrimary}; font-size: 16px; font-weight: 600;">
        🛡️ Security Tips
      </h3>
      <ul style="margin: 0; padding-left: 20px; color: ${COLORS.textSecondary}; font-size: 14px; line-height: 1.8;">
        <li>Never share this link with anyone</li>
        <li>Use a strong, unique password</li>
        <li>Enable two-factor authentication when available</li>
      </ul>
    </div>
    
    <!-- Didn't Request -->
    <div style="background-color: #f8f9fa; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 8px; color: ${COLORS.textPrimary}; font-size: 14px; font-weight: 600;">
        Didn't request this?
      </p>
      <p style="margin: 0; color: ${COLORS.textSecondary}; font-size: 14px; line-height: 1.6;">
        If you didn't request a password reset, please ignore this email. Your password will remain unchanged. 
        If you're concerned about your account security, please contact us immediately at 
        <a href="mailto:${COMPANY.email}" style="color: ${COLORS.primary};">${COMPANY.email}</a>.
      </p>
    </div>
    
    <!-- Alternative Link -->
    <p style="margin: 24px 0 0; padding: 16px; background-color: #f5f5f5; border-radius: 8px; color: ${COLORS.textLight}; font-size: 12px; word-break: break-all;">
      <strong>Can't click the button?</strong> Copy and paste this link into your browser:<br>
      <a href="${resetLink}" style="color: ${COLORS.primary};">${resetLink}</a>
    </p>
  `;
  
  return baseTemplate(content, {
    preheader: `Password reset link for your ${COMPANY.name} account. Expires in ${expiresIn}.`
  });
};

/**
 * Password Reset Success Confirmation
 */
export const passwordResetSuccessTemplate = (data) => {
  const { name, email, resetTime } = data;
  const displayName = name || 'User';
  
  const content = `
    <!-- Success Icon -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 80px; height: 80px; border-radius: 50%; background-color: #d4edda; line-height: 80px;">
        <span style="font-size: 40px;">✅</span>
      </div>
    </div>
    
    <h2 style="margin: 0 0 16px; color: ${COLORS.textPrimary}; font-size: 24px; font-weight: 700; text-align: center;">
      Password Changed Successfully
    </h2>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      Hi <strong>${displayName}</strong>,
    </p>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      Your password has been successfully changed for the ${COMPANY.name} admin account associated with <strong>${email}</strong>.
    </p>
    
    <!-- Details -->
    ${createInfoTable([
      { label: 'Account', value: email },
      { label: 'Changed At', value: resetTime || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) },
      { label: 'IP Address', value: data.ipAddress || 'Not recorded' },
    ])}
    
    <!-- Security Alert -->
    <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 8px; color: #856404; font-size: 16px; font-weight: 600;">
        ⚠️ Wasn't you?
      </p>
      <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
        If you didn't make this change, your account may be compromised. Please contact us immediately at 
        <a href="mailto:${COMPANY.email}" style="color: #856404; font-weight: 600;">${COMPANY.email}</a> 
        or call <a href="tel:${COMPANY.phone.replace(/\s/g, '')}" style="color: #856404; font-weight: 600;">${COMPANY.phone}</a>.
      </p>
    </div>
    
    <!-- Login Button -->
    <div style="text-align: center; margin: 32px 0;">
      ${createButton('Login to Admin Panel', `${COMPANY.website}/admin/login`)}
    </div>
  `;
  
  return baseTemplate(content, {
    preheader: `Your ${COMPANY.name} account password has been changed successfully.`
  });
};

/**
 * Admin Account Created
 */
export const adminAccountCreatedTemplate = (data) => {
  const { name, email, tempPassword, loginLink } = data;
  
  const content = `
    <!-- Welcome Icon -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 80px; height: 80px; border-radius: 50%; background-color: ${COLORS.primaryLight}; line-height: 80px;">
        <span style="font-size: 40px;">👋</span>
      </div>
    </div>
    
    <h2 style="margin: 0 0 16px; color: ${COLORS.textPrimary}; font-size: 24px; font-weight: 700; text-align: center;">
      Welcome to ${COMPANY.name} Admin
    </h2>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      Hi <strong>${name}</strong>,
    </p>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      An admin account has been created for you on the ${COMPANY.name} platform. You can now access the admin dashboard to manage products, quotes, dealers, and more.
    </p>
    
    <!-- Credentials Box -->
    <div style="background-color: #f8f9fa; border: 2px dashed ${COLORS.border}; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="margin: 0 0 16px; color: ${COLORS.primary}; font-size: 16px; font-weight: 600; text-align: center;">
        Your Login Credentials
      </h3>
      
      ${createInfoTable([
        { label: 'Email', value: email },
        { label: 'Temporary Password', value: tempPassword },
      ])}
      
      <p style="margin: 16px 0 0; color: #dc3545; font-size: 14px; font-weight: 600; text-align: center;">
        ⚠️ Please change your password immediately after first login
      </p>
    </div>
    
    <!-- Login Button -->
    <div style="text-align: center; margin: 32px 0;">
      ${createButton('Login to Admin Panel', loginLink || `${COMPANY.website}/admin/login`)}
    </div>
    
    <!-- What You Can Do -->
    <div style="border: 1px solid ${COLORS.border}; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 16px; color: ${COLORS.textPrimary}; font-size: 16px; font-weight: 600;">
        What you can do:
      </h3>
      <ul style="margin: 0; padding-left: 20px; color: ${COLORS.textSecondary}; font-size: 14px; line-height: 2;">
        <li>📦 Manage Products & Categories</li>
        <li>📝 Handle Quote Requests</li>
        <li>🤝 Approve/Manage Dealers</li>
        <li>📨 View Contact Inquiries</li>
        <li>📰 Manage Newsletter Subscribers</li>
        <li>⭐ Moderate Testimonials</li>
        <li>📊 View Dashboard Analytics</li>
      </ul>
    </div>
    
    <!-- Support -->
    <p style="margin: 24px 0 0; color: ${COLORS.textSecondary}; font-size: 14px; text-align: center;">
      Need help? Contact the IT team at <a href="mailto:${COMPANY.email}" style="color: ${COLORS.primary};">${COMPANY.email}</a>
    </p>
  `;
  
  return baseTemplate(content, {
    preheader: `Your ${COMPANY.name} admin account has been created. Login credentials inside.`
  });
};

/**
 * Login Alert (Suspicious Activity)
 */
export const loginAlertTemplate = (data) => {
  const { name, email, loginTime, ipAddress, location, device } = data;
  
  const content = `
    <!-- Alert Icon -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 80px; height: 80px; border-radius: 50%; background-color: #f8d7da; line-height: 80px;">
        <span style="font-size: 40px;">🔔</span>
      </div>
    </div>
    
    <h2 style="margin: 0 0 16px; color: ${COLORS.textPrimary}; font-size: 24px; font-weight: 700; text-align: center;">
      New Login Detected
    </h2>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      Hi <strong>${name || 'Admin'}</strong>,
    </p>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      We detected a new login to your ${COMPANY.name} admin account. If this was you, you can safely ignore this email.
    </p>
    
    <!-- Login Details -->
    ${createInfoTable([
      { label: 'Account', value: email },
      { label: 'Time', value: loginTime || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) },
      { label: 'IP Address', value: ipAddress || 'Unknown' },
      { label: 'Location', value: location || 'Unknown' },
      { label: 'Device', value: device || 'Unknown' },
    ])}
    
    <!-- Not You? -->
    <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 8px; color: #721c24; font-size: 16px; font-weight: 600;">
        🚨 Wasn't you?
      </p>
      <p style="margin: 0 0 16px; color: #721c24; font-size: 14px; line-height: 1.6;">
        If you didn't log in, your account may be compromised. Take these steps immediately:
      </p>
      <ol style="margin: 0; padding-left: 20px; color: #721c24; font-size: 14px; line-height: 1.8;">
        <li>Change your password immediately</li>
        <li>Review your account activity</li>
        <li>Contact us if you need help</li>
      </ol>
    </div>
    
    <!-- Action Buttons -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td align="center" style="padding: 0 8px;">
          ${createButton('Change Password', `${COMPANY.website}/admin/settings`)}
        </td>
      </tr>
    </table>
    
    <p style="margin: 24px 0 0; color: ${COLORS.textLight}; font-size: 12px; text-align: center;">
      This is an automated security alert. If you have questions, contact <a href="mailto:${COMPANY.email}" style="color: ${COLORS.primary};">${COMPANY.email}</a>
    </p>
  `;
  
  return baseTemplate(content, {
    preheader: `New login detected on your ${COMPANY.name} account from ${location || 'unknown location'}.`
  });
};

export const authTemplates = {
  passwordReset: passwordResetTemplate,
  passwordResetSuccess: passwordResetSuccessTemplate,
  accountCreated: adminAccountCreatedTemplate,
  loginAlert: loginAlertTemplate,
};
