/* eslint-disable no-console */
import process from 'process';
import path from 'path';
import fs from 'fs/promises';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, ...rest] = arg.replace(/^--/, '').split('=');
    return [k, rest.join('=') || 'true'];
  })
);

const BASE_URL = (args.baseUrl || process.env.QA_BASE_URL || 'https://pranijheightsindia.com').replace(/\/$/, '');
const API_BASE = `${BASE_URL}/api`;
const ADMIN_EMAIL = args.email || process.env.QA_ADMIN_EMAIL;
const ADMIN_PASSWORD = args.password || process.env.QA_ADMIN_PASSWORD;
const SOURCE_DIR = path.resolve(args.sourceDir || process.env.CATALOGUE_SOURCE_DIR || path.join(process.cwd(), '..', 'Heights All Pdf'));
const DRY_RUN = (args.dryRun || '').toLowerCase() === 'true';

if (!DRY_RUN && (!ADMIN_EMAIL || !ADMIN_PASSWORD)) {
  console.error('Missing admin credentials. Provide QA_ADMIN_EMAIL and QA_ADMIN_PASSWORD env vars or --email/--password args.');
  process.exit(1);
}

const categoryFromPath = (relativePath) => {
  const p = relativePath.toLowerCase();
  if (p.includes('technical') || p.includes('install')) return 'technical';
  if (p.includes('brochure') || p.includes('marketing')) return 'marketing';
  return 'product';
};

const normalizeSpace = (s) => s.replace(/\s+/g, ' ').trim();

const toTitle = (s) => {
  const cleaned = normalizeSpace(
    s
      .replace(/[_-]+/g, ' ')
      .replace(/\s+\./g, '.')
      .replace(/\.(pdf)$/i, '')
  );

  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

const isPdf = (fileName) => fileName.toLowerCase().endsWith('.pdf');

async function walkPdfs(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkPdfs(full)));
    } else if (entry.isFile() && isPdf(entry.name)) {
      files.push(full);
    }
  }

  return files;
}

async function api(pathname, { method = 'GET', token, body, headers = {} } = {}) {
  const finalHeaders = { ...headers };
  let payload = body;

  if (token) finalHeaders.Authorization = `Bearer ${token}`;
  if (body && !(body instanceof FormData) && typeof body === 'object') {
    finalHeaders['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${pathname}`, {
    method,
    headers: finalHeaders,
    body: payload,
  });

  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${pathname}: ${text}`);
  }

  return json;
}

async function fetchAllCatalogues(token) {
  const all = [];
  let page = 1;
  let pages = 1;

  while (page <= pages) {
    const result = await api(`/catalogues/admin/all?page=${page}&limit=100`, { token });
    const data = result?.data || [];
    const pagination = result?.pagination || {};
    pages = pagination.pages || 1;
    all.push(...data);
    page += 1;
  }

  return all;
}

async function main() {
  console.log(`Source directory: ${SOURCE_DIR}`);
  const pdfFiles = await walkPdfs(SOURCE_DIR);

  if (!pdfFiles.length) {
    console.error('No PDF files found in source directory.');
    process.exit(1);
  }

  console.log(`Found ${pdfFiles.length} PDF files.`);

  let token = null;
  let existingByName = new Map();

  if (!DRY_RUN) {
    const login = await api('/auth/login', {
      method: 'POST',
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });

    token = login?.data?.accessToken;
    if (!token) {
      console.error('Login succeeded but no access token returned.');
      process.exit(1);
    }

    const existing = await fetchAllCatalogues(token);
    existingByName = new Map(existing.map((c) => [c.name.toLowerCase(), c]));
  }

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (let i = 0; i < pdfFiles.length; i += 1) {
    const absolutePath = pdfFiles[i];
    const relativePath = path.relative(SOURCE_DIR, absolutePath).replace(/\\/g, '/');
    const parsed = path.parse(relativePath);
    const folderLabel = parsed.dir ? toTitle(parsed.dir.replace(/\//g, ' ')) : '';
    const baseTitle = toTitle(parsed.base);
    const displayName = normalizeSpace(folderLabel ? `${folderLabel} - ${baseTitle}` : baseTitle);
    const category = categoryFromPath(relativePath);
    const description = `Pranij Heights ${folderLabel || 'General'} catalogue`;

    process.stdout.write(`[${i + 1}/${pdfFiles.length}] ${displayName} ... `);

    try {
      if (DRY_RUN) {
        const maybe = existingByName.get(displayName.toLowerCase());
        if (maybe) {
          process.stdout.write('would update\n');
        } else {
          process.stdout.write('would create\n');
        }
        continue;
      }

      const buffer = await fs.readFile(absolutePath);
      const blob = new Blob([buffer], { type: 'application/pdf' });
      const form = new FormData();
      form.append('file', blob, path.basename(absolutePath));
      form.append('alt', displayName);

      const upload = await api('/upload/catalogue', {
        method: 'POST',
        token,
        body: form,
      });

      const fileUrl = upload?.data?.url;
      const fileSize = upload?.data?.size;
      const thumbnail = upload?.data?.thumbnailUrl || null;

      if (!fileUrl) {
        throw new Error('Upload did not return file URL');
      }

      const existingEntry = existingByName.get(displayName.toLowerCase());
      if (existingEntry) {
        await api(`/catalogues/admin/${existingEntry.id}`, {
          method: 'PUT',
          token,
          body: {
            name: displayName,
            description,
            fileUrl,
            fileSize,
            thumbnail,
            category,
            version: '2026',
            isActive: true,
          },
        });
        updated += 1;
        process.stdout.write('updated\n');
      } else {
        const create = await api('/catalogues/admin', {
          method: 'POST',
          token,
          body: {
            name: displayName,
            description,
            fileUrl,
            fileSize,
            thumbnail,
            category,
            version: '2026',
            isActive: true,
            order: i,
          },
        });

        const createdEntry = create?.data;
        if (createdEntry?.name) {
          existingByName.set(createdEntry.name.toLowerCase(), createdEntry);
        }

        created += 1;
        process.stdout.write('created\n');
      }
    } catch (err) {
      failed += 1;
      process.stdout.write(`failed (${err.message})\n`);
    }
  }

  console.log('\n=== SYNC SUMMARY ===');
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
  console.log(`Failed: ${failed}`);
  console.log(`Dry run: ${DRY_RUN}`);

  if (failed > 0) {
    process.exit(2);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
