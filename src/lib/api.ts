// Backend base URL. The jetfax-nextjs deployment hosts the user/events/
// settings/feedback APIs. No auth header — device_id is the soft identity.
export const API_BASE_URL = 'https://jetfax-nextjs.vercel.app';

/**
 * POST with retry. Returns parsed JSON on success, null on failure.
 * Used for user upsert where we need the returned server id.
 */
export async function postWithRetry<T>(
  path: string,
  body: Record<string, unknown>,
  maxRetries = 3,
): Promise<T | null> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) return (await res.json()) as T;
    } catch {
      // swallow — retry below
    }
    if (attempt < maxRetries - 1) {
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
  }
  return null;
}

/**
 * GET with retry. Returns parsed JSON on success, null on failure.
 */
export async function getWithRetry<T>(
  path: string,
  maxRetries = 3,
): Promise<T | null> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(`${API_BASE_URL}${path}`);
      if (res.ok) return (await res.json()) as T;
    } catch {
      // swallow — retry below
    }
    if (attempt < maxRetries - 1) {
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
  }
  return null;
}

/**
 * Fire-and-forget PATCH with exponential backoff. Never blocks the UI.
 * Used for background user updates (segment, last_opened_at, etc).
 */
export function backgroundPatch(
  path: string,
  body: Record<string, unknown>,
): void {
  void (async () => {
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await fetch(`${API_BASE_URL}${path}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (res.ok) return;
      } catch {
        // swallow — retry below
      }
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
      }
    }
  })();
}

/**
 * Fire-and-forget POST with exponential backoff. For analytics events.
 */
export function backgroundPost(
  path: string,
  body: Record<string, unknown>,
): void {
  void (async () => {
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await fetch(`${API_BASE_URL}${path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (res.ok) return;
      } catch {
        // swallow — retry below
      }
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
      }
    }
  })();
}
