/* eslint-disable no-console */
import process from 'process';

const BASE_URL = (process.env.QA_BASE_URL || 'https://pranijheightsindia.com').replace(/\/$/, '');
const API_BASE = `${BASE_URL}/api`;
const EXPECTED_API_MESSAGE = process.env.EXPECTED_API_MESSAGE || 'Pranijheightsindia API v1.0';
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@pranijheightsindia.com';
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

const checks = [];

const push = (name, ok, details = '') => {
  checks.push({ name, ok, details });
  console.log(`[${ok ? 'PASS' : 'FAIL'}] ${name}${details ? ` -> ${details}` : ''}`);
};

async function req(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return { response, body };
}

(async () => {
  try {
    const apiRoot = await req('/');
    const actualMessage = apiRoot.body?.message || '<missing>';
    push('API identity message matches expected backend', actualMessage === EXPECTED_API_MESSAGE, `actual="${actualMessage}" expected="${EXPECTED_API_MESSAGE}"`);

    const health = await fetch(`${BASE_URL}/health`);
    push('Health endpoint returns 200', health.status === 200, `status=${health.status}`);

    const defaultLogin = await req('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD }),
    });
    push('Default admin password is disabled', defaultLogin.response.status === 401, `status=${defaultLogin.response.status}`);

    const forgot = await req('/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: DEFAULT_ADMIN_EMAIL }),
    });
    push('Forgot-password endpoint is reachable', forgot.response.ok && forgot.body?.success === true, `status=${forgot.response.status}`);
  } catch (err) {
    push('Security verification runner', false, err.message);
  }

  const failed = checks.filter((c) => !c.ok);
  console.log('\n=== SECURITY VERIFICATION SUMMARY ===');
  console.table(checks.map((c) => ({ check: c.name, status: c.ok ? 'PASS' : 'FAIL', details: c.details })));

  if (failed.length > 0) {
    process.exit(2);
  }
})();
