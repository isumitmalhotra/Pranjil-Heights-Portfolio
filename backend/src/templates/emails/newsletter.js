/**
 * Email Templates - Newsletter
 * Templates for newsletter subscription
 */

import { baseTemplate, createButton, COLORS, COMPANY } from './base.js';

/**
 * Newsletter - Welcome Email
 */
export const newsletterWelcomeTemplate = (data) => {
  const { email, name } = data;
  const displayName = name || 'Valued Subscriber';
  
  const content = `
    <!-- Welcome Banner -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="font-size: 64px; margin-bottom: 16px;">🎉</div>
      <h2 style="margin: 0; color: ${COLORS.textPrimary}; font-size: 28px; font-weight: 700;">
        Welcome to the Family!
      </h2>
    </div>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6; text-align: center;">
      Hi <strong>${displayName}</strong>, thank you for subscribing to the ${COMPANY.name} newsletter!
    </p>
    
    <!-- What to Expect -->
    <div style="background-color: #fafafa; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="margin: 0 0 16px; color: ${COLORS.primary}; font-size: 18px; font-weight: 600; text-align: center;">
        What You'll Receive
      </h3>
      
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td width="50%" style="padding: 12px; text-align: center; vertical-align: top;">
            <div style="font-size: 32px; margin-bottom: 8px;">🆕</div>
            <div style="color: ${COLORS.textPrimary}; font-weight: 600; font-size: 14px;">New Products</div>
            <div style="color: ${COLORS.textSecondary}; font-size: 13px;">Latest product launches</div>
          </td>
          <td width="50%" style="padding: 12px; text-align: center; vertical-align: top;">
            <div style="font-size: 32px; margin-bottom: 8px;">🎁</div>
            <div style="color: ${COLORS.textPrimary}; font-weight: 600; font-size: 14px;">Exclusive Offers</div>
            <div style="color: ${COLORS.textSecondary}; font-size: 13px;">Subscriber-only deals</div>
          </td>
        </tr>
        <tr>
          <td width="50%" style="padding: 12px; text-align: center; vertical-align: top;">
            <div style="font-size: 32px; margin-bottom: 8px;">💡</div>
            <div style="color: ${COLORS.textPrimary}; font-weight: 600; font-size: 14px;">Industry Insights</div>
            <div style="color: ${COLORS.textSecondary}; font-size: 13px;">Tips & trends</div>
          </td>
          <td width="50%" style="padding: 12px; text-align: center; vertical-align: top;">
            <div style="font-size: 32px; margin-bottom: 8px;">📰</div>
            <div style="color: ${COLORS.textPrimary}; font-weight: 600; font-size: 14px;">Company News</div>
            <div style="color: ${COLORS.textSecondary}; font-size: 13px;">Events & updates</div>
          </td>
        </tr>
      </table>
    </div>
    
    <!-- Frequency Note -->
    <p style="margin: 20px 0; padding: 16px; background-color: #f0f9ff; border-radius: 8px; color: ${COLORS.textSecondary}; font-size: 14px; line-height: 1.6; text-align: center;">
      📬 We respect your inbox! Expect <strong>1-2 emails per month</strong> with only the most valuable content.
    </p>
    
    <!-- CTA -->
    <div style="text-align: center; margin: 32px 0;">
      ${createButton('Explore Our Products', `${COMPANY.website}/products`)}
    </div>
    
    <!-- Social Follow -->
    <div style="text-align: center; margin: 24px 0; padding-top: 24px; border-top: 1px solid ${COLORS.border};">
      <p style="margin: 0 0 12px; color: ${COLORS.textSecondary}; font-size: 14px;">
        Follow us for daily updates:
      </p>
      <a href="#" style="display: inline-block; margin: 0 8px;">
        <img src="https://cdn-icons-png.flaticon.com/32/733/733547.png" alt="Facebook" width="28" height="28">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px;">
        <img src="https://cdn-icons-png.flaticon.com/32/733/733558.png" alt="Instagram" width="28" height="28">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px;">
        <img src="https://cdn-icons-png.flaticon.com/32/733/733609.png" alt="LinkedIn" width="28" height="28">
      </a>
    </div>
    
    <!-- Unsubscribe -->
    <p style="margin: 24px 0 0; text-align: center; color: ${COLORS.textLight}; font-size: 12px;">
      Changed your mind? <a href="${COMPANY.website}/unsubscribe?email=${encodeURIComponent(email)}" style="color: ${COLORS.textLight};">Unsubscribe here</a>
    </p>
  `;
  
  return baseTemplate(content, {
    preheader: `Welcome to ${COMPANY.name} newsletter! Here's what to expect.`
  });
};

/**
 * Newsletter - Unsubscribe Confirmation
 */
export const newsletterUnsubscribeTemplate = (data) => {
  const { email } = data;
  
  const content = `
    <!-- Sad Icon -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="font-size: 64px; margin-bottom: 16px;">😢</div>
      <h2 style="margin: 0; color: ${COLORS.textPrimary}; font-size: 24px; font-weight: 700;">
        We're Sorry to See You Go
      </h2>
    </div>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6; text-align: center;">
      You have been successfully unsubscribed from the ${COMPANY.name} newsletter.
    </p>
    
    <p style="margin: 0 0 20px; color: ${COLORS.textSecondary}; font-size: 16px; line-height: 1.6; text-align: center;">
      You will no longer receive promotional emails from us at <strong>${email}</strong>.
    </p>
    
    <!-- Resubscribe Option -->
    <div style="background-color: #f9f9f9; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 16px; color: ${COLORS.textPrimary}; font-size: 16px;">
        Unsubscribed by mistake?
      </p>
      ${createButton('Resubscribe', `${COMPANY.website}/unsubscribe?email=${encodeURIComponent(email)}&resubscribe=true`)}
    </div>
    
    <p style="margin: 20px 0; color: ${COLORS.textLight}; font-size: 14px; text-align: center;">
      Note: You may still receive transactional emails related to your inquiries or quotes.
    </p>
  `;
  
  return baseTemplate(content, {
    preheader: `You have been unsubscribed from ${COMPANY.name} newsletter.`
  });
};

export const newsletterTemplates = {
  welcome: newsletterWelcomeTemplate,
  unsubscribe: newsletterUnsubscribeTemplate,
};
