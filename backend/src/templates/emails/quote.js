/**
 * Email Templates - Quote Request
 * Templates for quote request submissions
 */

import { baseTemplate, createButton, createInfoTable, createBadge, COLORS, COMPANY } from './base.js';

/**
 * Quote Request - User Confirmation Email
 */
export const quoteConfirmationTemplate = (data) => {
  const { 
    name, 
    // email is passed but used for sending, not in template
    referenceNumber, 
    projectType, 
    estimatedArea, 
    areaUnit = 'sq ft',
    preferredProducts,
    budget,
    timeline
  } = data;
  
  const content = `
    <!-- Success Icon -->
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark}); border-radius: 50%; line-height: 64px; font-size: 32px;">
        ✓
      </div>
    </div>
    
    <!-- Heading -->
    <h2 style="margin: 0 0 20px; color: ${COLORS.textPrimary}; font-size: 24px; text-align: center;">
      Quote Request Received!
    </h2>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      Dear <strong>${name}</strong>,
    </p>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      Thank you for requesting a quote from ${COMPANY.name}. Our team will analyze your requirements and prepare a customized quotation for you.
    </p>
    
    <!-- Reference Number Box -->
    <div style="background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark}); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 8px; color: rgba(255,255,255,0.8); font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
        Your Reference Number
      </p>
      <p style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 2px;">
        ${referenceNumber}
      </p>
      <p style="margin: 12px 0 0; color: rgba(255,255,255,0.7); font-size: 13px;">
        Please save this number for future reference
      </p>
    </div>
    
    <!-- Request Summary -->
    <div style="background-color: #fafafa; border: 1px solid ${COLORS.border}; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 16px; color: ${COLORS.textPrimary}; font-size: 16px; font-weight: 600;">
        📋 Your Request Summary
      </h3>
      ${createInfoTable([
        ['Project Type', projectType || 'Not specified'],
        ['Estimated Area', estimatedArea ? `${estimatedArea} ${areaUnit}` : 'Not specified'],
        ['Preferred Products', Array.isArray(preferredProducts) ? preferredProducts.join(', ') : (preferredProducts || 'Not specified')],
        ['Budget Range', budget || 'Not specified'],
        ['Timeline', timeline || 'Not specified'],
      ])}
    </div>
    
    <!-- Timeline -->
    <h3 style="margin: 24px 0 16px; color: ${COLORS.textPrimary}; font-size: 18px;">
      ⏱️ Expected Timeline
    </h3>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td width="33%" style="text-align: center; padding: 16px;">
          <div style="font-size: 24px; margin-bottom: 8px;">📥</div>
          <div style="color: ${COLORS.primary}; font-weight: 600; font-size: 14px;">Step 1</div>
          <div style="color: ${COLORS.textSecondary}; font-size: 13px;">Request Received</div>
        </td>
        <td width="33%" style="text-align: center; padding: 16px;">
          <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
          <div style="color: ${COLORS.primary}; font-weight: 600; font-size: 14px;">Step 2</div>
          <div style="color: ${COLORS.textSecondary}; font-size: 13px;">Analysis (1-2 days)</div>
        </td>
        <td width="33%" style="text-align: center; padding: 16px;">
          <div style="font-size: 24px; margin-bottom: 8px;">📄</div>
          <div style="color: ${COLORS.primary}; font-weight: 600; font-size: 14px;">Step 3</div>
          <div style="color: ${COLORS.textSecondary}; font-size: 13px;">Quote Delivered</div>
        </td>
      </tr>
    </table>
    
    <!-- CTA -->
    <div style="text-align: center; margin: 32px 0;">
      ${createButton('Download Catalogue', `${COMPANY.website}/resources#catalogue`)}
    </div>
    
    <!-- Note -->
    <p style="margin: 24px 0 0; padding: 16px; background-color: #f0f9ff; border-radius: 8px; color: ${COLORS.textSecondary}; font-size: 14px; line-height: 1.6;">
      💡 <strong>Tip:</strong> Have your project blueprints or measurements ready. It helps us provide a more accurate quote!
    </p>
  `;
  
  return baseTemplate(content, {
    preheader: `Your quote request ${referenceNumber} has been received. We'll respond within 24-48 hours.`
  });
};

/**
 * Quote Request - Admin Notification Email
 */
export const quoteAdminNotificationTemplate = (data) => {
  const { 
    id,
    referenceNumber, 
    name, 
    email, 
    phone,
    company,
    projectType, 
    projectDetails,
    estimatedArea, 
    areaUnit = 'sq ft',
    preferredProducts,
    budget,
    timeline,
    deliveryAddress,
    additionalNotes,
    createdAt
  } = data;
  
  // Determine priority based on budget/area
  let priority = 'normal';
  let priorityColor = 'info';
  if (budget && (budget.includes('10') || budget.includes('lakh') || budget.includes('crore'))) {
    priority = 'HIGH PRIORITY';
    priorityColor = 'error';
  } else if (estimatedArea && parseFloat(estimatedArea) > 5000) {
    priority = 'HIGH VALUE';
    priorityColor = 'warning';
  }
  
  const content = `
    <!-- Alert Header -->
    <div style="text-align: center; margin-bottom: 24px;">
      ${createBadge('NEW QUOTE REQUEST', 'success')}
      ${priority !== 'normal' ? createBadge(priority, priorityColor) : ''}
    </div>
    
    <h2 style="margin: 0 0 8px; color: ${COLORS.textPrimary}; font-size: 22px; text-align: center;">
      Quote Request: ${referenceNumber}
    </h2>
    <p style="margin: 0 0 24px; color: ${COLORS.textSecondary}; font-size: 14px; text-align: center;">
      Submitted on ${new Date(createdAt || Date.now()).toLocaleString('en-IN', { 
        dateStyle: 'full', 
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      })}
    </p>
    
    <!-- Customer Details -->
    <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 16px; color: #166534; font-size: 16px; font-weight: 600;">
        👤 Customer Information
      </h3>
      ${createInfoTable([
        ['Name', name],
        ['Email', `<a href="mailto:${email}" style="color: ${COLORS.primary};">${email}</a>`],
        ['Phone', phone ? `<a href="tel:${phone}" style="color: ${COLORS.primary};">${phone}</a>` : 'Not provided'],
        ['Company', company || 'Not provided'],
      ])}
    </div>
    
    <!-- Project Details -->
    <div style="background-color: #fff9e6; border: 1px solid ${COLORS.primary}; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 16px; color: ${COLORS.textPrimary}; font-size: 16px; font-weight: 600;">
        📐 Project Requirements
      </h3>
      ${createInfoTable([
        ['Project Type', projectType || 'Not specified'],
        ['Estimated Area', estimatedArea ? `<strong>${estimatedArea} ${areaUnit}</strong>` : 'Not specified'],
        ['Preferred Products', Array.isArray(preferredProducts) ? preferredProducts.join(', ') : (preferredProducts || 'Not specified')],
        ['Budget Range', budget ? `<strong>${budget}</strong>` : 'Not specified'],
        ['Timeline', timeline || 'Not specified'],
        ['Delivery Address', deliveryAddress || 'Not specified'],
      ])}
    </div>
    
    ${projectDetails || additionalNotes ? `
    <!-- Additional Details -->
    <div style="background-color: #fafafa; border: 1px solid ${COLORS.border}; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 12px; color: ${COLORS.textPrimary}; font-size: 16px; font-weight: 600;">
        📝 Additional Details
      </h3>
      ${projectDetails ? `
        <p style="margin: 0 0 12px; color: ${COLORS.textSecondary}; font-size: 14px;"><strong>Project Details:</strong></p>
        <p style="margin: 0 0 16px; color: ${COLORS.textPrimary}; font-size: 14px; white-space: pre-wrap;">${projectDetails}</p>
      ` : ''}
      ${additionalNotes ? `
        <p style="margin: 0 0 12px; color: ${COLORS.textSecondary}; font-size: 14px;"><strong>Notes:</strong></p>
        <p style="margin: 0; color: ${COLORS.textPrimary}; font-size: 14px; white-space: pre-wrap;">${additionalNotes}</p>
      ` : ''}
    </div>
    ` : ''}
    
    <!-- Action Buttons -->
    <div style="text-align: center; margin: 32px 0;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
        <tr>
          <td style="padding-right: 12px;">
            ${createButton('Prepare Quote', `${COMPANY.website}/admin/quotes?id=${id || ''}`)}
          </td>
          <td>
            ${createButton('Contact Customer', `mailto:${email}?subject=Re: Quote Request ${referenceNumber}`, 'secondary')}
          </td>
        </tr>
      </table>
    </div>
  `;
  
  return baseTemplate(content, {
    preheader: `New quote request ${referenceNumber} from ${name} - ${projectType || 'General'}`,
    showSocial: false
  });
};

export const quoteTemplates = {
  confirmation: quoteConfirmationTemplate,
  adminNotification: quoteAdminNotificationTemplate,
};
