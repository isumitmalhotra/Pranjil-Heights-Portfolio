import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const sitemapIndexPath = path.join(publicDir, 'sitemap-index.xml');
const sitemapPagesPath = path.join(publicDir, 'sitemap-pages.xml');
const sitemapProductsPath = path.join(publicDir, 'sitemap-products.xml');
const legacySitemapPath = path.join(publicDir, 'sitemap.xml');

const SITE_URL = (process.env.SITE_URL || 'https://pranijheightsindia.com').replace(/\/+$/, '');
const API_BASE = (
  process.env.SITEMAP_API_URL ||
  process.env.VITE_API_URL ||
  `${SITE_URL}/api`
).replace(/\/+$/, '');

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/products', changefreq: 'daily', priority: '0.9' },
  { path: '/compare', changefreq: 'weekly', priority: '0.7' },
  { path: '/resources', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/dealer', changefreq: 'monthly', priority: '0.8' },
  { path: '/unsubscribe', changefreq: 'yearly', priority: '0.3' },
];

const toIsoDate = (value) => {
  const parsed = value ? new Date(value) : new Date();
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString().split('T')[0];
  return parsed.toISOString().split('T')[0];
};

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&apos;');

async function fetchApiProducts() {
  const endpoints = [
    `${API_BASE}/products?limit=all&sortBy=createdAt&order=desc`,
    `${API_BASE}/products?limit=1000&sortBy=createdAt&order=desc`,
    `${API_BASE}/products?limit=1000`,
    `${API_BASE}/products`,
  ];

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        lastError = new Error(`Failed to fetch products from API (${response.status}) for ${endpoint}`);
        continue;
      }

      const payload = await response.json();
      const products = payload?.data?.products;
      if (!Array.isArray(products)) {
        lastError = new Error(`Unexpected products payload for ${endpoint}`);
        continue;
      }

      return products;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Unable to fetch products from API');
}

async function loadStaticProductsFallback() {
  const modulePath = path.join(rootDir, 'src', 'data', 'products.js');
  const moduleUrl = new URL(`file://${modulePath.replace(/\\/g, '/')}`);
  const module = await import(moduleUrl.href);
  return Array.isArray(module.products) ? module.products : [];
}

function normalizeProductUrls(products) {
  const unique = new Map();

  for (const product of products) {
    const key = product?.slug || product?.id;
    if (!key) continue;

    const encodedKey = encodeURIComponent(String(key));
    const loc = `${SITE_URL}/products/${encodedKey}`;

    if (!unique.has(loc)) {
      unique.set(loc, {
        loc,
        lastmod: toIsoDate(product?.updatedAt || product?.createdAt),
        changefreq: 'weekly',
        priority: '0.8',
      });
    }
  }

  return [...unique.values()];
}

function buildUrlSetXml(entries) {
  const urlNodes = entries
    .map(
      (entry) => `  <url>\n` +
        `    <loc>${escapeXml(entry.loc)}</loc>\n` +
        `    <lastmod>${entry.lastmod}</lastmod>\n` +
        `    <changefreq>${entry.changefreq}</changefreq>\n` +
        `    <priority>${entry.priority}</priority>\n` +
        `  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urlNodes}\n` +
    `</urlset>\n`;
}

function buildSitemapIndexXml(sitemaps) {
  const sitemapNodes = sitemaps
    .map(
      (entry) => `  <sitemap>\n` +
        `    <loc>${escapeXml(entry.loc)}</loc>\n` +
        `    <lastmod>${entry.lastmod}</lastmod>\n` +
        `  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${sitemapNodes}\n` +
    `</sitemapindex>\n`;
}

function buildPageEntries(staticRoutes) {
  const today = toIsoDate(new Date());

  return staticRoutes.map((route) => ({
    loc: `${SITE_URL}${route.path === '/' ? '' : route.path}` || SITE_URL,
    changefreq: route.changefreq,
    priority: route.priority,
    lastmod: today,
  }));
}

async function main() {
  let products = [];

  try {
    products = await fetchApiProducts();
    console.log(`Fetched ${products.length} products from ${API_BASE}`);
  } catch (error) {
    console.warn(`API fetch failed for sitemap generation: ${error.message}`);
    products = await loadStaticProductsFallback();
    console.log(`Using static fallback product list (${products.length} items)`);
  }

  const productRoutes = normalizeProductUrls(products);
  const pageRoutes = buildPageEntries(STATIC_ROUTES);

  const pagesXml = buildUrlSetXml(pageRoutes);
  const productsXml = buildUrlSetXml(productRoutes);

  const lastmod = toIsoDate(new Date());
  const indexXml = buildSitemapIndexXml([
    { loc: `${SITE_URL}/sitemap-pages.xml`, lastmod },
    { loc: `${SITE_URL}/sitemap-products.xml`, lastmod },
  ]);

  await fs.mkdir(publicDir, { recursive: true });
  await Promise.all([
    fs.writeFile(sitemapPagesPath, pagesXml, 'utf8'),
    fs.writeFile(sitemapProductsPath, productsXml, 'utf8'),
    fs.writeFile(sitemapIndexPath, indexXml, 'utf8'),
    // Keep legacy path for existing Search Console submissions.
    fs.writeFile(legacySitemapPath, indexXml, 'utf8'),
  ]);

  console.log(`Generated sitemap index with ${2} child sitemaps at ${sitemapIndexPath}`);
  console.log(`Pages sitemap URLs: ${pageRoutes.length} (${sitemapPagesPath})`);
  console.log(`Products sitemap URLs: ${productRoutes.length} (${sitemapProductsPath})`);
}

main().catch((error) => {
  console.error('Sitemap generation failed:', error);
  process.exitCode = 1;
});
