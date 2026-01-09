'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api';

type ListResponse = {
  success: boolean;
  data: {
    items: Array<{
      id: string;
      contentType: string;
      slug: string;
      title: string;
      status: string;
      publishedAt: string | null;
      updatedAt: string;
    }>;
    total: number;
    limit: number;
    offset: number;
  };
};

export default function ContentListPage() {
  const [status, setStatus] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ListResponse['data'] | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (type) params.set('contentType', type);
    if (status) params.set('status', status);
    params.set('limit', '50');
    params.set('offset', '0');
    return params.toString();
  }, [status, type]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    apiFetch<ListResponse>(`/api/admin/content?${query}`).then((res) => {
      if (cancelled) return;
      if (!res.ok) {
        setError(`Ошибка загрузки (${res.status}). Проверь, что ты залогинен в API и CORS настроен.`);
        setItems(null);
      } else {
        setItems(res.data.data);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <main>
      <h1>Контент</h1>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <a href="/">← Главная</a>
        <a href="/content/article/new">+ Новая статья</a>
        <a href="/content/resource/new">+ Новый ресурс</a>
        <a href="/content/landing/new">+ Новый лендинг</a>
        <a href="/content/page/new">+ Новая страница</a>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        <label>
          Тип:{' '}
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">(все)</option>
            <option value="article">article</option>
            <option value="resource">resource</option>
            <option value="landing">landing</option>
            <option value="page">page</option>
          </select>
        </label>
        <label>
          Статус:{' '}
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">(все)</option>
            <option value="draft">draft</option>
            <option value="review">review</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </label>
      </div>

      {loading && <p style={{ marginTop: 16 }}>Загрузка…</p>}
      {error && (
        <p style={{ marginTop: 16, color: '#b91c1c' }}>
          <strong>Ошибка:</strong> {error}
        </p>
      )}

      {items && (
        <div style={{ marginTop: 16 }}>
          <p>
            Всего: <strong>{items.total}</strong>
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Тип</th>
                  <th style={th}>Заголовок</th>
                  <th style={th}>Slug</th>
                  <th style={th}>Статус</th>
                  <th style={th}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {items.items.map((it) => (
                  <tr key={it.id}>
                    <td style={td}>{it.contentType}</td>
                    <td style={td}>{it.title}</td>
                    <td style={td}>
                      <code>{it.slug}</code>
                    </td>
                    <td style={td}>{it.status}</td>
                    <td style={td}>
                      <a href={`/content/${it.contentType}/${it.id}`}>Открыть</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}

const th: React.CSSProperties = {
  textAlign: 'left',
  borderBottom: '1px solid #e2e8f0',
  padding: '8px 10px',
  fontWeight: 600,
};

const td: React.CSSProperties = {
  borderBottom: '1px solid #e2e8f0',
  padding: '8px 10px',
  verticalAlign: 'top',
};

