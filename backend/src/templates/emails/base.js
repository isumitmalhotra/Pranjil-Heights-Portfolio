/* global process */
/**
 * Base Email Template
 * Production-ready HTML email templates with responsive design
 */

// Company branding colors
const COLORS = {
  primary: '#D4AF37',      // Gold
  primaryDark: '#B8960F',  // Dark Gold
  background: '#1a1a1a',   // Dark background
  cardBg: '#ffffff',       // White card background
  textPrimary: '#333333',  // Dark text
  textSecondary: '#666666', // Gray text
  textLight: '#999999',    // Light gray
  border: '#e0e0e0',       // Border color
  success: '#22c55e',      // Green
  warning: '#f59e0b',      // Amber
  error: '#ef4444',        // Red
};

// Company info
const COMPANY = {
  name: 'Pranijheightsindia',
  tagline: 'Premium PVC Panel Manufacturer',
  website: process.env.FRONTEND_URL || 'https://pranijheightsindia.com',
  email: 'contact@pranijheightsindia.com',
  phone: '+91 XXXXX XXXXX',
  address: 'Your Address, City, State, India',
  logo: 'https://pranijheightsindia.com/logo.png', // Update with actual logo URL
};

/**
 * Base HTML email wrapper with responsive design
 */
export const baseTemplate = (content, options = {}) => {
  const { preheader = '', showFooter = true, showSocial = true } = options;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${COMPANY.name}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    
    /* Base */
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f4f4f4; }
    
    /* Links */
    a { color: ${COLORS.primary}; text-decoration: none; }
    a:hover { text-decoration: underline; }
    
    /* Button */
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark});
      color: #ffffff !important;
      text-decoration: none !important;
      font-weight: 600;
      font-size: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 14px rgba(212, 175, 55, 0.3);
    }
    
    /* Responsive */
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 10px !important; }
      .content { padding: 20px !important; }
      .header { padding: 20px !important; }
      .button { padding: 12px 24px !important; font-size: 14px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  
  <!-- Preheader (hidden preview text) -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    ${preheader}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  
  <!-- Main Container -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Email Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td class="header" style="background: linear-gradient(135deg, ${COLORS.background}, #2a2a2a); padding: 30px 40px; text-align: center;">
              <img src="${COMPANY.logo}" alt="${COMPANY.name} Logo" width="72" height="72" style="display: block; margin: 0 auto 14px; border-radius: 12px; object-fit: contain; background: #ffffff; padding: 6px;" />
              <h1 style="margin: 0; color: ${COLORS.primary}; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                ${COMPANY.name.toUpperCase()}
              </h1>
              <p style="margin: 8px 0 0; color: #888888; font-size: 14px; letter-spacing: 2px;">
                ${COMPANY.tagline.toUpperCase()}
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="content" style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          ${showFooter ? `
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px 40px; border-top: 1px solid ${COLORS.border};">
              
              ${showSocial ? `
              <!-- Social Links -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <a href="#" style="display: inline-block; margin: 0 8px;">
                      <img src="https://cdn-icons-png.flaticon.com/32/733/733547.png" alt="Facebook" width="24" height="24">
                    </a>
                    <a href="#" style="display: inline-block; margin: 0 8px;">
                      <img src="https://cdn-icons-png.flaticon.com/32/733/733558.png" alt="Instagram" width="24" height="24">
                    </a>
                    <a href="#" style="display: inline-block; margin: 0 8px;">
                      <img src="https://cdn-icons-png.flaticon.com/32/733/733561.png" alt="Twitter" width="24" height="24">
                    </a>
                    <a href="#" style="display: inline-block; margin: 0 8px;">
                      <img src="https://cdn-icons-png.flaticon.com/32/733/733609.png" alt="LinkedIn" width="24" height="24">
                    </a>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              <!-- Contact Info -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="color: ${COLORS.textSecondary}; font-size: 14px; line-height: 1.6;">
                    <p style="margin: 0 0 8px;">
                      <a href="mailto:${COMPANY.email}" style="color: ${COLORS.primary};">${COMPANY.email}</a> | 
                      <a href="tel:${COMPANY.phone.replace(/\s/g, '')}" style="color: ${COLORS.primary};">${COMPANY.phone}</a>
                    </p>
                    <p style="margin: 0 0 8px;">
                      ${COMPANY.address}
                    </p>
                    <p style="margin: 0;">
                      <a href="${COMPANY.website}" style="color: ${COLORS.primary};">${COMPANY.website.replace('https://', '')}</a>
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Copyright -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-top: 20px; color: ${COLORS.textLight}; font-size: 12px;">
                    <p style="margin: 0;">
                      © ${new Date().getFullYear()} ${COMPANY.name}. All rights reserved.
                    </p>
                    <p style="margin: 8px 0 0;">
                      <a href="${COMPANY.website}/privacy" style="color: ${COLORS.textLight};">Privacy Policy</a> | 
                      <a href="${COMPANY.website}/terms" style="color: ${COLORS.textLight};">Terms of Service</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `.trim();
};

/**
 * Helper: Create a styled button
 */
export const createButton = (text, url, style = 'primary') => {
  const bgColor = style === 'primary' 
    ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`
    : '#ffffff';
  const textColor = style === 'primary' ? '#ffffff' : COLORS.primary;
  const border = style === 'primary' ? 'none' : `2px solid ${COLORS.primary}`;
  
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="border-radius: 8px; background: ${bgColor}; border: ${border};">
          <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 32px; color: ${textColor}; text-decoration: none; font-weight: 600; font-size: 16px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
};

/**
 * Helper: Create info row
 */
export const infoRow = (label, value) => `
  <tr>
    <td style="padding: 8px 0; border-bottom: 1px solid ${COLORS.border};">
      <strong style="color: ${COLORS.textSecondary};">${label}:</strong>
    </td>
    <td style="padding: 8px 0 8px 16px; border-bottom: 1px solid ${COLORS.border}; color: ${COLORS.textPrimary};">
      ${value || 'Not provided'}
    </td>
  </tr>
`;

/**
 * Helper: Create info table
 */
export const createInfoTable = (rows) => `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0;">
    ${rows.map(([label, value]) => infoRow(label, value)).join('')}
  </table>
`;

/**
 * Helper: Create badge
 */
export const createBadge = (text, type = 'info') => {
  const colors = {
    info: { bg: '#e0f2fe', text: '#0369a1' },
    success: { bg: '#dcfce7', text: '#166534' },
    warning: { bg: '#fef3c7', text: '#92400e' },
    error: { bg: '#fee2e2', text: '#dc2626' },
  };
  const { bg, text: textColor } = colors[type] || colors.info;
  
  return `<span style="display: inline-block; padding: 4px 12px; background-color: ${bg}; color: ${textColor}; font-size: 12px; font-weight: 600; border-radius: 20px;">${text}</span>`;
};

export { COLORS, COMPANY };
