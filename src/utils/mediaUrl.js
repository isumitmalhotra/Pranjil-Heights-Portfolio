const getApiOrigin = () => {
  const envApiUrl = import.meta.env.VITE_API_URL?.trim();
  if (envApiUrl) {
    try {
      return new URL(envApiUrl).origin;
    } catch {
      // Fall back to runtime origin if env url is malformed.
    }
  }
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
};

const toAbsoluteUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  if (/^https?:\/\//i.test(url)) return url;
  const origin = getApiOrigin();
  if (!origin) return url;
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const getMediaCandidates = (url) => {
  if (!url || typeof url !== 'string') return [];

  const normalized = url.replace(/\\/g, '/').trim();
  if (!normalized) return [];

  const candidates = [];

  if (/^https?:\/\//i.test(normalized)) {
    candidates.push(normalized);
  } else {
    candidates.push(normalized);

    if (normalized.startsWith('/uploads/')) {
      candidates.push(normalized.replace('/uploads/', '/api/uploads/'));
    }

    if (normalized.startsWith('/api/uploads/')) {
      candidates.push(normalized.replace('/api/uploads/', '/uploads/'));
    }
  }

  return Array.from(new Set(candidates.map((candidate) => toAbsoluteUrl(candidate)).filter(Boolean)));
};

export const attachMediaFallback = (event) => {
  const el = event.currentTarget;
  const candidates = (el.dataset.mediaCandidates || '').split('|').filter(Boolean);
  const nextIndex = Number.parseInt(el.dataset.mediaIndex || '0', 10) + 1;

  if (nextIndex < candidates.length) {
    el.dataset.mediaIndex = String(nextIndex);
    el.src = candidates[nextIndex];
    return;
  }

  el.dataset.mediaFailed = 'true';
};

export const getPrimaryMediaUrl = (url) => {
  const candidates = getMediaCandidates(url);
  return candidates[0] || null;
};
