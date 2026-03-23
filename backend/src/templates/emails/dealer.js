/**
 * Email Templates - Dealer Application
 * Templates for dealer/distributor applications
 */

import { baseTemplate, createButton, createInfoTable, createBadge, COLORS, COMPANY } from './base.js';

/**
 * Dealer Application - User Confirmation Email
 */
export const dealerConfirmationTemplate = (data) => {
  const { 
    companyName,
    contactPerson, 
    email, 
    referenceNumber,
    city,
    state
  } = data;
  
  const content = `
    <!-- Success Banner -->
    <div style="background: linear-gradient(135deg, ${COLORS.background}, #2a2a2a); border-radius: 12px; padding: 32px; margin-bottom: 24px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 16px;">🤝</div>
      <h2 style="margin: 0; color: ${COLORS.primary}; font-size: 24px; font-weight: 700;">
        Application Submitted Successfully!
      </h2>
    </div>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      Dear <strong>${contactPerson}</strong>,
    </p>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      Thank you for your interest in becoming an authorized dealer of ${COMPANY.name}. We have received your application for <strong>${companyName}</strong> and our partnership team will review it carefully.
    </p>
    
    <!-- Reference Number Box -->
    <div style="background-color: #f9f9f9; border: 2px dashed ${COLORS.primary}; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 8px; color: ${COLORS.textSecondary}; font-size: 14px;">
        Application Reference Number
      </p>
      <p style="margin: 0; color: ${COLORS.primary}; font-size: 28px; font-weight: 700; letter-spacing: 2px;">
        ${referenceNumber}
      </p>
    </div>
    
    <!-- Application Summary -->
    <div style="background-color: #fafafa; border: 1px solid ${COLORS.border}; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 16px; color: ${COLORS.textPrimary}; font-size: 16px; font-weight: 600;">
        📋 Application Summary
      </h3>
      ${createInfoTable([
        ['Company Name', companyName],
        ['Contact Person', contactPerson],
        ['Email', email],
        ['Location', `${city || 'N/A'}, ${state || 'N/A'}`],
      ])}
    </div>
    
    <!-- What's Next -->
    <h3 style="margin: 24px 0 16px; color: ${COLORS.textPrimary}; font-size: 18px;">
      📌 What Happens Next?
    </h3>
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid ${COLORS.border};">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td width="48" style="vertical-align: top;">
                <div style="width: 32px; height: 32px; background-color: ${COLORS.primary}; color: #fff; border-radius: 50%; text-align: center; line-height: 32px; font-weight: 600;">1</div>
              </td>
              <td style="padding-left: 12px;">
                <div style="color: ${COLORS.textPrimary}; font-weight: 600;">Application Review</div>
                <div style="color: ${COLORS.textSecondary}; font-size: 14px;">Our team will review your application within 3-5 business days</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid ${COLORS.border};">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td width="48" style="vertical-align: top;">
                <div style="width: 32px; height: 32px; background-color: ${COLORS.primary}; color: #fff; border-radius: 50%; text-align: center; line-height: 32px; font-weight: 600;">2</div>
              </td>
              <td style="padding-left: 12px;">
                <div style="color: ${COLORS.textPrimary}; font-weight: 600;">Verification Call</div>
                <div style="color: ${COLORS.textSecondary}; font-size: 14px;">A representative will contact you to discuss details</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td width="48" style="vertical-align: top;">
                <div style="width: 32px; height: 32px; background-color: ${COLORS.primary}; color: #fff; border-radius: 50%; text-align: center; line-height: 32px; font-weight: 600;">3</div>
              </td>
              <td style="padding-left: 12px;">
                <div style="color: ${COLORS.textPrimary}; font-weight: 600;">Partnership Agreement</div>
                <div style="color: ${COLORS.textSecondary}; font-size: 14px;">Upon approval, we'll send you the dealer agreement and onboarding details</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <!-- Benefits -->
    <div style="background: linear-gradient(135deg, #fef9e7, #fff9e6); border: 1px solid ${COLORS.primary}; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 12px; color: ${COLORS.primary}; font-size: 16px; font-weight: 600;">
        ⭐ Dealer Benefits
      </h3>
      <ul style="margin: 0; padding-left: 20px; color: ${COLORS.textSecondary}; font-size: 14px; line-height: 2;">
        <li>Exclusive territory rights</li>
        <li>Attractive dealer margins</li>
        <li>Marketing & technical support</li>
        <li>Priority stock allocation</li>
        <li>Training & certification programs</li>
      </ul>
    </div>
    
    <!-- CTA -->
    <div style="text-align: center; margin: 32px 0;">
      ${createButton('View Product Catalogue', `${COMPANY.website}/resources#catalogue`)}
    </div>
  `;
  
  return baseTemplate(content, {
    preheader: `Your dealer application ${referenceNumber} has been submitted. We'll contact you within 3-5 business days.`
  });
};

/**
 * Dealer Application - Admin Notification Email
 */
export const dealerAdminNotificationTemplate = (data) => {
  const { 
    id,
    referenceNumber, 
    companyName,
    businessType,
    gstNumber,
    contactPerson, 
    designation,
    email, 
    phone,
    address,
    city,
    state,
    pincode,
    annualTurnover,
    warehouseArea,
    showroomArea,
    salesTeamSize,
    yearsInBusiness,
    existingBrands,
    coverageAreas,
    createdAt
  } = data;
  
  const content = `
    <!-- Alert Header -->
    <div style="text-align: center; margin-bottom: 24px;">
      ${createBadge('NEW DEALER APPLICATION', 'success')}
    </div>
    
    <h2 style="margin: 0 0 8px; color: ${COLORS.textPrimary}; font-size: 22px; text-align: center;">
      ${companyName}
    </h2>
    <p style="margin: 0 0 24px; color: ${COLORS.textSecondary}; font-size: 14px; text-align: center;">
      Application #${referenceNumber} • ${new Date(createdAt || Date.now()).toLocaleString('en-IN', { 
        dateStyle: 'medium', 
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      })}
    </p>
    
    <!-- Contact Information -->
    <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 16px; color: #166534; font-size: 16px; font-weight: 600;">
        👤 Contact Information
      </h3>
      ${createInfoTable([
        ['Contact Person', contactPerson],
        ['Designation', designation || 'Not specified'],
        ['Email', `<a href="mailto:${email}" style="color: ${COLORS.primary};">${email}</a>`],
        ['Phone', phone ? `<a href="tel:${phone}" style="color: ${COLORS.primary};">${phone}</a>` : 'Not provided'],
      ])}
    </div>
    
    <!-- Business Information -->
    <div style="background-color: #fff9e6; border: 1px solid ${COLORS.primary}; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 16px; color: ${COLORS.textPrimary}; font-size: 16px; font-weight: 600;">
        🏢 Business Details
      </h3>
      ${createInfoTable([
        ['Business Type', businessType || 'Not specified'],
        ['GST Number', gstNumber || 'Not provided'],
        ['Annual Turnover', annualTurnover || 'Not specified'],
        ['Years in Business', yearsInBusiness || 'Not specified'],
        ['Warehouse Area', warehouseArea ? `${warehouseArea} sq ft` : 'Not specified'],
        ['Showroom Area', showroomArea ? `${showroomArea} sq ft` : 'Not specified'],
        ['Sales Team Size', salesTeamSize || 'Not specified'],
      ])}
    </div>
    
    <!-- Location -->
    <div style="background-color: #fafafa; border: 1px solid ${COLORS.border}; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 16px; color: ${COLORS.textPrimary}; font-size: 16px; font-weight: 600;">
        📍 Location & Coverage
      </h3>
      ${createInfoTable([
        ['Address', address || 'Not provided'],
        ['City', city || 'Not provided'],
        ['State', state || 'Not provided'],
        ['Pincode', pincode || 'Not provided'],
        ['Coverage Areas', Array.isArray(coverageAreas) ? coverageAreas.join(', ') : (coverageAreas || 'Not specified')],
      ])}
    </div>
    
    ${existingBrands ? `
    <!-- Existing Brands -->
    <div style="background-color: #f5f3ff; border: 1px solid #7c3aed; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 12px; color: #5b21b6; font-size: 16px; font-weight: 600;">
        🏷️ Currently Dealing With
      </h3>
      <p style="margin: 0; color: ${COLORS.textPrimary}; font-size: 14px;">
        ${Array.isArray(existingBrands) ? existingBrands.join(', ') : existingBrands}
      </p>
    </div>
    ` : ''}
    
    <!-- Action Buttons -->
    <div style="text-align: center; margin: 32px 0;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
        <tr>
          <td style="padding-right: 12px;">
            ${createButton('Review Application', `${COMPANY.website}/admin/dealers?id=${id || ''}`)}
          </td>
          <td>
            ${createButton('Call Applicant', `tel:${phone}`, 'secondary')}
          </td>
        </tr>
      </table>
    </div>
  `;
  
  return baseTemplate(content, {
    preheader: `New dealer application from ${companyName}, ${city} - ${referenceNumber}`,
    showSocial: false
  });
};

/**
 * Dealer Application - Status Update Email
 */
export const dealerStatusUpdateTemplate = (data) => {
  const { 
    companyName,
    contactPerson, 
    referenceNumber,
    status,
    notes
  } = data;
  
  const statusConfig = {
    APPROVED: {
      icon: '🎉',
      title: 'Congratulations! Your Application is Approved',
      color: '#22c55e',
      bgColor: '#f0fdf4',
      message: 'We are delighted to welcome you to the Pranijheightsindia dealer family! Our team will contact you shortly with the partnership agreement and onboarding details.'
    },
    REJECTED: {
      icon: '😔',
      title: 'Application Update',
      color: '#ef4444',
      bgColor: '#fef2f2',
      message: 'After careful review, we regret to inform you that we are unable to proceed with your dealer application at this time. Please feel free to reapply after 6 months or contact us for more details.'
    },
    UNDER_REVIEW: {
      icon: '🔍',
      title: 'Application Under Review',
      color: '#f59e0b',
      bgColor: '#fffbeb',
      message: 'Your application is currently being reviewed by our partnership team. We will update you on the status within the next few days.'
    },
  };
  
  const config = statusConfig[status] || statusConfig.UNDER_REVIEW;
  
  const content = `
    <!-- Status Banner -->
    <div style="background-color: ${config.bgColor}; border: 2px solid ${config.color}; border-radius: 12px; padding: 32px; margin-bottom: 24px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 16px;">${config.icon}</div>
      <h2 style="margin: 0; color: ${config.color}; font-size: 22px; font-weight: 700;">
        ${config.title}
      </h2>
    </div>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      Dear <strong>${contactPerson}</strong>,
    </p>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6;">
      ${config.message}
    </p>
    
    <!-- Reference Info -->
    <div style="background-color: #f9f9f9; border-radius: 8px; padding: 16px; margin: 24px 0;">
      ${createInfoTable([
        ['Company', companyName],
        ['Reference Number', referenceNumber],
        ['Status', `<strong style="color: ${config.color};">${status.replace('_', ' ')}</strong>`],
      ])}
    </div>
    
    ${notes ? `
    <div style="background-color: #f9f9f9; border-left: 4px solid ${COLORS.primary}; padding: 16px 20px; margin: 24px 0;">
      <p style="margin: 0 0 8px; color: ${COLORS.textSecondary}; font-size: 14px; font-weight: 600;">Additional Notes:</p>
      <p style="margin: 0; color: ${COLORS.textPrimary}; font-size: 15px;">${notes}</p>
    </div>
    ` : ''}
    
    <!-- CTA -->
    <div style="text-align: center; margin: 32px 0;">
      ${createButton('Contact Us', `mailto:${COMPANY.email}?subject=Re: Dealer Application ${referenceNumber}`)}
    </div>
  `;
  
  return baseTemplate(content, {
    preheader: `Dealer application ${referenceNumber} - ${status.replace('_', ' ')}`
  });
};

export const dealerTemplates = {
  confirmation: dealerConfirmationTemplate,
  adminNotification: dealerAdminNotificationTemplate,
  statusUpdate: dealerStatusUpdateTemplate,
};
