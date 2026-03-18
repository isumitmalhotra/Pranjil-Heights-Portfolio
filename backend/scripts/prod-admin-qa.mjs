/* eslint-disable no-console */
import process from 'process';

const BASE_URL = (process.env.QA_BASE_URL || 'https://pranijheightsindia.com').replace(/\/$/, '');
const API_BASE = `${BASE_URL}/api`;
const ADMIN_EMAIL = process.env.QA_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.QA_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Missing required env vars: QA_ADMIN_EMAIL and QA_ADMIN_PASSWORD');
  process.exit(1);
}

const stamp = Date.now();
const unique = `qa-${stamp}`;
const qaEmail = `${unique}@example.com`;

const results = [];
let token = null;

const pushResult = (module, test, passed, details = '') => {
  results.push({ module, test, passed, details });
  const icon = passed ? 'PASS' : 'FAIL';
  console.log(`[${icon}] ${module} :: ${test}${details ? ` -> ${details}` : ''}`);
};

const toQuery = (params = {}) => {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.append(k, String(v));
  });
  const q = usp.toString();
  return q ? `?${q}` : '';
};

async function api(path, { method = 'GET', body, auth = false, headers = {}, expectStatus, raw = false } = {}) {
  const h = { ...headers };

  let finalBody = body;
  if (body && !(body instanceof FormData) && typeof body === 'object') {
    h['Content-Type'] = 'application/json';
    finalBody = JSON.stringify(body);
  }

  if (auth) {
    if (!token) throw new Error('Missing auth token');
    h.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: h,
    body: finalBody,
  });

  if (expectStatus && res.status !== expectStatus) {
    const txt = await res.text();
    throw new Error(`Expected ${expectStatus}, got ${res.status}: ${txt}`);
  }

  if (!res.ok && !expectStatus) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }

  if (raw) {
    return { status: res.status, headers: res.headers, text: await res.text() };
  }

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return { status: res.status, text: await res.text(), headers: res.headers };
}

async function runModule(module, fn) {
  try {
    await fn();
  } catch (err) {
    pushResult(module, 'module-failure', false, err.message);
  }
}

(async () => {
  console.log(`Running production admin QA against ${API_BASE}`);

  // Auth
  try {
    const loginResp = await api('/auth/login', {
      method: 'POST',
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });
    token = loginResp?.data?.accessToken;
    pushResult('AUTH', 'admin login', !!token, token ? 'token received' : 'token missing');
    if (!token) throw new Error('No token in login response');
  } catch (err) {
    pushResult('AUTH', 'admin login', false, err.message);
    throw err;
  }

  let categoryId;
  let productId;
  let contactId;
  let quoteId;
  let dealerId;
  let testimonialId;
  let subscriberId;
  let catalogueId;
  let mediaId;

  await runModule('CATEGORIES', async () => {
    const createResp = await api('/categories', {
      method: 'POST',
      auth: true,
      body: {
        name: `QA Category ${unique}`,
        description: 'QA category validation',
        isActive: true,
      },
    });
    categoryId = createResp?.data?.category?.id;
    pushResult('CATEGORIES', 'create', !!categoryId, `id=${categoryId}`);

    const updateResp = await api(`/categories/${categoryId}`, {
      method: 'PUT',
      auth: true,
      body: {
        name: `QA Category Updated ${unique}`,
        description: 'Updated by QA',
        isActive: true,
      },
    });
    pushResult('CATEGORIES', 'update', !!updateResp?.success);

    const listResp = await api('/categories', { auth: true });
    const exists = (listResp?.data?.categories || []).some((c) => c.id === categoryId);
    pushResult('CATEGORIES', 'list', exists);
  });

  await runModule('PRODUCTS', async () => {
    const payload = {
      name: `QA Product ${unique}`,
      description: 'QA product created by automation',
      shortDescription: 'QA short',
      categoryId,
      sku: `QA-SKU-${stamp}`,
      features: ['feature-a'],
      applications: ['application-a'],
      finishes: [],
      images: [],
      isFeatured: false,
      isActive: true,
      sortOrder: 0,
      unit: 'sq ft',
      price: 123,
    };

    const createResp = await api('/products', {
      method: 'POST',
      auth: true,
      body: payload,
    });
    productId = createResp?.data?.product?.id;
    pushResult('PRODUCTS', 'create', !!productId, `id=${productId}`);

    const updateResp = await api(`/products/${productId}`, {
      method: 'PUT',
      auth: true,
      body: { ...payload, name: `QA Product Updated ${unique}` },
    });
    pushResult('PRODUCTS', 'update', !!updateResp?.success);

    const listResp = await api(`/products${toQuery({ search: unique, page: 1, limit: 10 })}`, { auth: true });
    const exists = (listResp?.data?.products || []).some((p) => p.id === productId);
    pushResult('PRODUCTS', 'list', exists);

    const delResp = await api(`/products/${productId}`, { method: 'DELETE', auth: true });
    pushResult('PRODUCTS', 'delete', !!delResp?.success);
  });

  await runModule('CONTACTS', async () => {
    const createResp = await api('/contact', {
      method: 'POST',
      body: {
        name: 'QA Contact',
        email: qaEmail,
        phone: '+911234567890',
        company: 'QA Co',
        subject: `QA Contact ${unique}`,
        message: 'This is a QA contact message long enough.',
      },
    });
    pushResult('CONTACTS', 'public submit', !!createResp?.success);

    const listResp = await api(`/contact${toQuery({ search: qaEmail, page: 1, limit: 10 })}`, { auth: true });
    const found = listResp?.data?.contacts?.[0];
    contactId = found?.id;
    pushResult('CONTACTS', 'admin list', !!contactId, `id=${contactId}`);

    const statusResp = await api(`/contact/${contactId}/status`, {
      method: 'PUT',
      auth: true,
      body: { status: 'RESPONDED', notes: 'QA status update' },
    });
    pushResult('CONTACTS', 'status update', !!statusResp?.success);

    const exportResp = await api('/contact/export', { auth: true, raw: true });
    const isCsv = (exportResp?.headers?.get('content-type') || '').includes('text/csv');
    pushResult('CONTACTS', 'export', isCsv);

    const delResp = await api(`/contact/${contactId}`, { method: 'DELETE', auth: true });
    pushResult('CONTACTS', 'delete', !!delResp?.success);
  });

  await runModule('QUOTES', async () => {
    const createResp = await api('/quotes', {
      method: 'POST',
      body: {
        name: 'QA Quote',
        email: qaEmail,
        phone: '+911234567890',
        projectType: 'Residential',
      },
    });
    pushResult('QUOTES', 'public submit', !!createResp?.success);

    const listResp = await api(`/quotes${toQuery({ search: qaEmail, page: 1, limit: 10 })}`, { auth: true });
    const found = listResp?.data?.quotes?.[0];
    quoteId = found?.id;
    pushResult('QUOTES', 'admin list', !!quoteId, `id=${quoteId}`);

    const statusResp = await api(`/quotes/${quoteId}/status`, {
      method: 'PUT',
      auth: true,
      body: {
        status: 'QUOTED',
        quotedAmount: 10000,
        notes: 'QA quote',
      },
    });
    pushResult('QUOTES', 'status update', !!statusResp?.success);

    const exportResp = await api('/quotes/export', { auth: true, raw: true });
    const isCsv = (exportResp?.headers?.get('content-type') || '').includes('text/csv');
    pushResult('QUOTES', 'export', isCsv);

    const delResp = await api(`/quotes/${quoteId}`, { method: 'DELETE', auth: true });
    pushResult('QUOTES', 'delete', !!delResp?.success);
  });

  await runModule('DEALERS', async () => {
    const createResp = await api('/dealers/apply', {
      method: 'POST',
      body: {
        companyName: `QA Dealer ${unique}`,
        contactPerson: 'QA Person',
        email: qaEmail,
        phone: '+911234567890',
        address: 'QA Street',
        city: 'Delhi',
        state: 'Delhi',
      },
    });
    pushResult('DEALERS', 'public apply', !!createResp?.success);

    const listResp = await api(`/dealers${toQuery({ search: qaEmail, page: 1, limit: 10 })}`, { auth: true });
    const found = listResp?.data?.applications?.[0];
    dealerId = found?.id;
    pushResult('DEALERS', 'admin list', !!dealerId, `id=${dealerId}`);

    const statusResp = await api(`/dealers/${dealerId}/status`, {
      method: 'PATCH',
      auth: true,
      body: { status: 'UNDER_REVIEW', notes: 'QA dealer review' },
    });
    pushResult('DEALERS', 'status update', !!statusResp?.success);

    const exportResp = await api('/dealers/export', { auth: true, raw: true });
    const isCsv = (exportResp?.headers?.get('content-type') || '').includes('text/csv');
    pushResult('DEALERS', 'export', isCsv);

    const delResp = await api(`/dealers/${dealerId}`, { method: 'DELETE', auth: true });
    pushResult('DEALERS', 'delete', !!delResp?.success);
  });

  await runModule('TESTIMONIALS', async () => {
    const createResp = await api('/testimonials', {
      method: 'POST',
      auth: true,
      body: {
        name: `QA Testimonial ${unique}`,
        company: 'QA Corp',
        role: 'Manager',
        content: 'This is a QA testimonial entry.',
        rating: 5,
      },
    });
    testimonialId = createResp?.data?.testimonial?.id;
    pushResult('TESTIMONIALS', 'create', !!testimonialId, `id=${testimonialId}`);

    const listResp = await api(`/testimonials/all${toQuery({ search: unique, page: 1, limit: 10 })}`, { auth: true });
    const exists = (listResp?.data?.testimonials || []).some((t) => t.id === testimonialId);
    pushResult('TESTIMONIALS', 'list', exists);

    const updateResp = await api(`/testimonials/${testimonialId}`, {
      method: 'PUT',
      auth: true,
      body: {
        name: `QA Testimonial Updated ${unique}`,
        company: 'QA Corp',
        role: 'Manager',
        content: 'Updated content',
        rating: 4,
      },
    });
    pushResult('TESTIMONIALS', 'update', !!updateResp?.success);

    const delResp = await api(`/testimonials/${testimonialId}`, { method: 'DELETE', auth: true });
    pushResult('TESTIMONIALS', 'delete', !!delResp?.success);
  });

  await runModule('NEWSLETTER', async () => {
    const subResp = await api('/newsletter/subscribe', {
      method: 'POST',
      body: { email: qaEmail, name: 'QA Subscriber', source: 'qa-script' },
    });
    pushResult('NEWSLETTER', 'subscribe', !!subResp?.success);

    const listResp = await api(`/newsletter/subscribers${toQuery({ search: qaEmail, page: 1, limit: 10 })}`, { auth: true });
    const found = listResp?.data?.subscribers?.find((s) => s.email === qaEmail);
    subscriberId = found?.id;
    pushResult('NEWSLETTER', 'list', !!subscriberId, `id=${subscriberId}`);

    const delResp = await api(`/newsletter/${subscriberId}`, { method: 'DELETE', auth: true });
    pushResult('NEWSLETTER', 'delete', !!delResp?.success);
  });

  await runModule('CATALOGUES', async () => {
    const createResp = await api('/catalogues/admin', {
      method: 'POST',
      auth: true,
      body: {
        name: `QA Catalogue ${unique}`,
        description: 'QA catalogue for validation',
        fileUrl: '/catalogues/qa-catalogue.pdf',
        fileSize: 1024,
        category: 'product',
        version: 'qa',
        isActive: true,
        order: 0,
      },
    });
    catalogueId = createResp?.data?.id;
    pushResult('CATALOGUES', 'create', !!catalogueId, `id=${catalogueId}`);

    const statsResp = await api('/catalogues/admin/stats', { auth: true });
    pushResult('CATALOGUES', 'stats', !!statsResp?.success);

    const historyResp = await api('/catalogues/admin/downloads', { auth: true });
    pushResult('CATALOGUES', 'download history', !!historyResp?.success);

    const updateResp = await api(`/catalogues/admin/${catalogueId}`, {
      method: 'PUT',
      auth: true,
      body: { description: 'QA updated description' },
    });
    pushResult('CATALOGUES', 'update', !!updateResp?.success);

    const delResp = await api(`/catalogues/admin/${catalogueId}`, { method: 'DELETE', auth: true });
    pushResult('CATALOGUES', 'delete', !!delResp?.success);
  });

  await runModule('MEDIA', async () => {
    const form = new FormData();
    const blob = new Blob(['%PDF-1.4\n% QA test file'], { type: 'application/pdf' });
    form.append('file', blob, `qa-${unique}.pdf`);
    form.append('folder', 'general');
    form.append('alt', 'QA media upload');

    const uploadResp = await api('/upload', {
      method: 'POST',
      auth: true,
      body: form,
    });
    mediaId = uploadResp?.data?.id;
    pushResult('MEDIA', 'upload', !!mediaId, `id=${mediaId}`);

    const listResp = await api(`/upload/media${toQuery({ search: unique, page: 1, limit: 10 })}`, { auth: true });
    const exists = (listResp?.data?.media || []).some((m) => m.id === mediaId);
    pushResult('MEDIA', 'list', exists);

    const delResp = await api(`/upload/${mediaId}`, { method: 'DELETE', auth: true });
    pushResult('MEDIA', 'delete', !!delResp?.success);
  });

  await runModule('CATEGORIES', async () => {
    if (categoryId) {
      const delResp = await api(`/categories/${categoryId}`, { method: 'DELETE', auth: true });
      pushResult('CATEGORIES', 'delete', !!delResp?.success);
    }
  });

  const failed = results.filter((r) => !r.passed);
  console.log('\n================ QA SUMMARY ================');
  console.table(results.map((r) => ({
    module: r.module,
    test: r.test,
    status: r.passed ? 'PASS' : 'FAIL',
    details: r.details,
  })));

  if (failed.length > 0) {
    console.error(`\nQA finished with ${failed.length} failed checks.`);
    process.exit(2);
  }

  console.log('\nQA finished successfully with all checks passing.');
})();
