import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { GetHomepageModelUseCase } from './application/homepage/GetHomepageModelUseCase';
import { StaticHomepageRepository } from './infrastructure/homepage/StaticHomepageRepository';
import { validateEventProperties } from './infrastructure/analytics/validateEventProperties';
import { Homepage } from './presentation/homepage/Homepage';

describe('web smoke', () => {
  it('homepage model содержит темы и ключевые CTA', async () => {
    const useCase = new GetHomepageModelUseCase(new StaticHomepageRepository());
    const model = await useCase.execute({ locale: 'ru' });

    expect(model.pagePath).toBe('/');
    expect(model.topics.length).toBeGreaterThanOrEqual(3);
    expect(model.topics.length).toBeLessThanOrEqual(5);

    expect(model.ctas.bookingHref).toBe('/booking/');
    expect(model.ctas.firstStepHref).toBe('/start/first-step/');
    expect(model.ctas.navigatorHref).toBe('/start/navigator/');
  });

  it('главная рендерит ключевые ссылки (smoke e2e через SSR)', async () => {
    const useCase = new GetHomepageModelUseCase(new StaticHomepageRepository());
    const model = await useCase.execute({ locale: 'ru' });

    const html = renderToStaticMarkup(React.createElement(Homepage, { model }));

    expect(html).toContain('href="/booking/"');
    expect(html).toContain('href="/start/first-step/"');
    expect(html).toContain('href="/start/navigator/"');
    expect(html).toContain('href="/s-chem-ya-pomogayu/trevoga/"');
    expect(html).toContain('data-event="view_problem_card"');
    expect(html).toContain('data-event="cta_click"');
    expect(html).toContain('data-trust-block=');
    expect(html).toContain('data-faq-id=');
  });

  it('валидатор аналитики отклоняет PII/тексты', () => {
    expect(() => validateEventProperties({ email: 'test@example.com' })).toThrow();
    expect(() => validateEventProperties({ question_text: 'что угодно' })).toThrow();
    expect(() => validateEventProperties({ cta_id: 'booking_primary', cta_target: 'booking' })).not.toThrow();
  });
});
