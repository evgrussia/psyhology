'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import type { FeaturedLink } from '../../domain/homepage/HomepageModel';

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; items: FeaturedLink[] };

export function HomepageFeaturedFromApi({ fallback }: { fallback: FeaturedLink[] }) {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/public/homepage', { method: 'GET' });
        if (!res.ok) throw new Error('bad_status');
        const data = (await res.json()) as { featured?: FeaturedLink[] };
        const items = Array.isArray(data.featured) ? data.featured : [];
        if (cancelled) return;
        setState({ status: 'success', items });
      } catch {
        if (cancelled) return;
        setState({ status: 'error' });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const items = state.status === 'success' && state.items.length > 0 ? state.items : fallback;

  return (
    <div className="featuredBlock" aria-label="Подборка">
      <div className="featuredHeader">
        <h3 className="h3">Рекомендации</h3>
        {state.status === 'loading' ? <span className="chip">Загружаем…</span> : null}
        {state.status === 'error' ? <span className="chip chipError">Не удалось загрузить — показываем базовый вариант</span> : null}
      </div>

      {items.length === 0 ? (
        <p className="muted">
          Пока нет подборки — можно начать с <a href="/start/first-step/">первого шага</a> или перейти к{' '}
          <a href="/booking/">записи</a>.
        </p>
      ) : (
        <ul className="featuredList">
          {items.map((x) => (
            <li key={x.id}>
              <a
                className="featuredLink"
                href={x.href}
                data-event="cta_click"
                data-cta-id={`featured_${x.id}`}
                data-cta-target={x.kind}
              >
                <div className="featuredTitle">{x.title}</div>
                {x.description ? <div className="featuredDesc">{x.description}</div> : null}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

