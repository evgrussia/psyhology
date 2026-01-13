'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '../../../../lib/api';
import { MarkdownEditor } from '../../../../components/MarkdownEditor';

type ContentItem = {
  id: string;
  contentType: string;
  slug: string;
  title: string;
  excerpt: string | null;
  bodyMarkdown: string | null;
  status: string;
  publishedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  topicCodes: string[];
  tagIds: string[];
  updatedAt: string;
};

type ApiEnvelope<T> = { success: boolean; data: T };

type MediaList = ApiEnvelope<{
  items: Array<{
    id: string;
    publicUrl: string;
    mimeType: string;
    mediaType: string;
    title: string | null;
    altText: string | null;
  }>;
  total: number;
  limit: number;
  offset: number;
}>;

export default function ContentEditorPage() {
  const params = useParams<{ type: string; id: string }>();
  const router = useRouter();

  const contentType = params.type;
  const id = params.id;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [item, setItem] = useState<ContentItem | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [bodyMarkdown, setBodyMarkdown] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [topicCodesText, setTopicCodesText] = useState('');
  const [tagIdsText, setTagIdsText] = useState('');

  const [qaDisclaimer, setQaDisclaimer] = useState(false);
  const [qaAlt, setQaAlt] = useState(false);
  const [qaCta, setQaCta] = useState(false);

  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [previewLoading, setPreviewLoading] = useState(false);

  const [mediaOpen, setMediaOpen] = useState(false);
  const [media, setMedia] = useState<MediaList['data'] | null>(null);
  const [mediaLoading, setMediaLoading] = useState(false);

  const topicCodes = useMemo(
    () =>
      topicCodesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    [topicCodesText],
  );

  const tagIds = useMemo(
    () =>
      tagIdsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    [tagIdsText],
  );

  useEffect(() => {
    if (isNew) {
      setItem(null);
      setTitle('');
      setSlug('');
      setExcerpt('');
      setBodyMarkdown('');
      setMetaTitle('');
      setMetaDescription('');
      setCanonicalUrl('');
      setTopicCodesText('');
      setTagIdsText('');
      setPreviewHtml('');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    apiFetch<ApiEnvelope<ContentItem>>(`/api/admin/content/${id}`).then((res) => {
      if (cancelled) return;
      if (!res.ok) {
        setError(`Ошибка загрузки (${res.status}).`);
        setLoading(false);
        return;
      }
      const data = res.data.data;
      setItem(data);
      setTitle(data.title || '');
      setSlug(data.slug || '');
      setExcerpt(data.excerpt || '');
      setBodyMarkdown(data.bodyMarkdown || '');
      setMetaTitle(data.metaTitle || '');
      setMetaDescription(data.metaDescription || '');
      setCanonicalUrl(data.canonicalUrl || '');
      setTopicCodesText((data.topicCodes || []).join(', '));
      setTagIdsText((data.tagIds || []).join(', '));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  async function loadMedia() {
    setMediaLoading(true);
    const res = await apiFetch<MediaList>(`/api/admin/media?limit=50&offset=0`);
    if (!res.ok) {
      setError(`Не удалось загрузить медиа (${res.status}).`);
      setMedia(null);
    } else {
      setMedia(res.data.data);
    }
    setMediaLoading(false);
  }

  async function refreshPreview() {
    setPreviewLoading(true);
    const res = await apiFetch<ApiEnvelope<{ html: string }>>('/api/admin/content/preview', {
      method: 'POST',
      json: { markdown: bodyMarkdown },
    });
    if (!res.ok) {
      setError(`Preview ошибка (${res.status}).`);
      setPreviewHtml('');
    } else {
      setPreviewHtml(res.data.data.html || '');
    }
    setPreviewLoading(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    setNotice(null);

    const payload = {
      contentType,
      title,
      slug: slug || undefined,
      excerpt: excerpt || null,
      bodyMarkdown: bodyMarkdown || null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      canonicalUrl: canonicalUrl || null,
      topicCodes,
      tagIds,
    };

    const res = isNew
      ? await apiFetch<ApiEnvelope<ContentItem>>('/api/admin/content', { method: 'POST', json: payload })
      : await apiFetch<ApiEnvelope<ContentItem>>(`/api/admin/content/${id}`, { method: 'PUT', json: payload });

    if (!res.ok) {
      setError(`Сохранение не удалось (${res.status}).`);
      setSaving(false);
      return;
    }

    const saved = res.data.data;
    setItem(saved);
    setNotice('Сохранено.');

    // если это create → переходим на страницу по id
    if (isNew) {
      router.replace(`/content/${saved.contentType}/${saved.id}`);
    }

    setSaving(false);
  }

  async function publish() {
    if (!item) {
      setError('Сначала сохрани контент.');
      return;
    }

    setPublishing(true);
    setError(null);
    setNotice(null);

    const res = await apiFetch<ApiEnvelope<ContentItem>>(`/api/admin/content/${item.id}/publish`, {
      method: 'POST',
      json: { qaChecklist: { hasDisclaimer: qaDisclaimer, hasAltText: qaAlt, hasCta: qaCta } },
    });

    if (!res.ok) {
      setError(`Публикация не удалась (${res.status}). Проверь QA чеклист (дисклеймер/alt/CTA).`);
      setPublishing(false);
      return;
    }

    setItem(res.data.data);
    setNotice('Опубликовано.');
    setPublishing(false);
  }

  async function archive() {
    if (!item) {
      setError('Сначала сохрани контент.');
      return;
    }

    setArchiving(true);
    setError(null);
    setNotice(null);

    const res = await apiFetch<ApiEnvelope<ContentItem>>(`/api/admin/content/${item.id}/archive`, {
      method: 'POST',
    });

    if (!res.ok) {
      setError(`Архивирование не удалось (${res.status}).`);
      setArchiving(false);
      return;
    }

    setItem(res.data.data);
    setNotice('Заархивировано.');
    setArchiving(false);
  }

  function insertMarkdown(text: string) {
    setBodyMarkdown((prev) => (prev ? `${prev}\n\n${text}\n` : `${text}\n`));
    setMediaOpen(false);
  }

  return (
    <main>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <a href="/content">← Список</a>
        <a href="/">Главная</a>
      </div>

      <h1 style={{ marginTop: 12 }}>
        {isNew ? 'Новый контент' : 'Редактор'}: <code>{contentType}</code>
      </h1>

      {item && (
        <p style={{ marginTop: 8, color: '#334155' }}>
          <strong>Статус:</strong> {item.status} {item.publishedAt ? `· publishedAt: ${item.publishedAt}` : ''}
        </p>
      )}

      {loading && <p style={{ marginTop: 16 }}>Загрузка…</p>}
      {error && (
        <p style={{ marginTop: 16, color: '#b91c1c' }}>
          <strong>Ошибка:</strong> {error}
        </p>
      )}
      {notice && (
        <p style={{ marginTop: 16, color: '#166534' }}>
          <strong>OK:</strong> {notice}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <section style={panel}>
          <h2 style={h2}>Поля</h2>
          <label style={label}>
            Заголовок
            <input style={input} value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label style={label}>
            Slug (опционально)
            <input style={input} value={slug} onChange={(e) => setSlug(e.target.value)} />
          </label>
          <label style={label}>
            Excerpt
            <textarea style={textarea} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </label>
          <label style={label}>
            Topic codes (через запятую)
            <input style={input} value={topicCodesText} onChange={(e) => setTopicCodesText(e.target.value)} />
          </label>
          <label style={label}>
            Tag IDs (через запятую)
            <input style={input} value={tagIdsText} onChange={(e) => setTagIdsText(e.target.value)} />
          </label>

          <h3 style={h3}>SEO</h3>
          <label style={label}>
            Meta title
            <input style={input} value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
          </label>
          <label style={label}>
            Meta description
            <textarea style={textarea} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
          </label>
          <label style={label}>
            Canonical URL
            <input style={input} value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />
          </label>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
            <button disabled={saving} onClick={save}>
              {saving ? 'Сохранение…' : 'Сохранить'}
            </button>
            <button disabled={publishing} onClick={publish}>
              {publishing ? 'Публикация…' : 'Опубликовать'}
            </button>
            <button disabled={archiving} onClick={archive}>
              {archiving ? 'Архив…' : 'Архивировать'}
            </button>
          </div>

          <h3 style={h3}>QA чеклист публикации</h3>
          <label style={checkbox}>
            <input type="checkbox" checked={qaDisclaimer} onChange={(e) => setQaDisclaimer(e.target.checked)} />
            Дисклеймер есть
          </label>
          <label style={checkbox}>
            <input type="checkbox" checked={qaAlt} onChange={(e) => setQaAlt(e.target.checked)} />
            Alt для изображений есть
          </label>
          <label style={checkbox}>
            <input type="checkbox" checked={qaCta} onChange={(e) => setQaCta(e.target.checked)} />
            CTA есть
          </label>
        </section>

        <section style={panel}>
          <h2 style={h2}>Markdown</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setMediaOpen(true);
                if (!media) void loadMedia();
              }}
            >
              Вставить медиа…
            </button>
            <button disabled={previewLoading} onClick={refreshPreview}>
              {previewLoading ? 'Preview…' : 'Обновить preview'}
            </button>
            {item?.status === 'published' && (
              <a
                href={`http://localhost:3000/blog/${item.slug}/`}
                target="_blank"
                rel="noreferrer"
              >
                Открыть публично
              </a>
            )}
          </div>

          <div style={{ marginTop: 8 }}>
            <MarkdownEditor value={bodyMarkdown} onChange={setBodyMarkdown} minHeight={260} />
          </div>

          <h3 style={h3}>Live preview (через backend renderer)</h3>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, background: '#fff' }}>
            {previewHtml ? (
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <p style={{ margin: 0, color: '#64748b' }}>Нажми «Обновить preview».</p>
            )}
          </div>
        </section>
      </div>

      {mediaOpen && (
        <div style={modalBackdrop} role="dialog" aria-modal="true">
          <div style={modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>Медиа</h2>
              <button onClick={() => setMediaOpen(false)}>Закрыть</button>
            </div>

            {mediaLoading && <p>Загрузка…</p>}
            {!mediaLoading && !media && (
              <p style={{ color: '#b91c1c' }}>Нет данных. Проверь авторизацию/доступ к /api/admin/media.</p>
            )}

            {media && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 12 }}>
                {media.items.map((m) => (
                  <button
                    key={m.id}
                    style={mediaCard}
                    onClick={() => {
                      const alt = (m.altText || m.title || '').replace(/[\r\n]/g, ' ').trim();
                      const markdown = m.mediaType === 'image' ? `![${alt}](${m.publicUrl})` : `[${alt || m.publicUrl}](${m.publicUrl})`;
                      insertMarkdown(markdown);
                    }}
                  >
                    <div style={{ fontSize: 12, color: '#475569', textAlign: 'left' }}>{m.mediaType}</div>
                    <div style={{ fontSize: 12, color: '#0f172a', textAlign: 'left' }}>
                      {m.title || m.altText || m.id}
                    </div>
                    {m.mediaType === 'image' && (
                      <img
                        src={m.publicUrl}
                        alt={m.altText || ''}
                        style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6, marginTop: 8 }}
                      />
                    )}
                    {m.mediaType !== 'image' && (
                      <div style={{ marginTop: 8, fontSize: 12, color: '#334155', wordBreak: 'break-all' }}>
                        {m.publicUrl}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

const panel: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 16,
  background: '#f8fafc',
};

const h2: React.CSSProperties = { margin: 0, marginBottom: 12, fontSize: 18 };
const h3: React.CSSProperties = { marginTop: 16, marginBottom: 8, fontSize: 14 };

const label: React.CSSProperties = { display: 'block', marginTop: 10, fontSize: 12, color: '#0f172a' };
const input: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 6,
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  background: '#fff',
};
const textarea: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 6,
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  background: '#fff',
  minHeight: 90,
  resize: 'vertical',
};
const checkbox: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 };

const modalBackdrop: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.5)',
  padding: 24,
  overflow: 'auto',
};
const modal: React.CSSProperties = {
  maxWidth: 960,
  margin: '0 auto',
  background: '#fff',
  borderRadius: 12,
  padding: 16,
};
const mediaCard: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 12,
  background: '#f8fafc',
  cursor: 'pointer',
};

