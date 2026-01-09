export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:3001';

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<{ ok: true; data: T } | { ok: false; status: number; error: unknown }> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers = new Headers(init?.headers);

  let body = init?.body;
  if (init && 'json' in init) {
    headers.set('content-type', 'application/json');
    body = JSON.stringify((init as any).json ?? null);
  }

  try {
    const res = await fetch(url, {
      ...init,
      headers,
      body,
      credentials: 'include',
      cache: 'no-store',
    });

    const text = await res.text();
    const payload = text ? safeJsonParse(text) : null;

    if (!res.ok) {
      return { ok: false, status: res.status, error: payload ?? text };
    }

    return { ok: true, data: payload as T };
  } catch (e) {
    return { ok: false, status: 0, error: e };
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

