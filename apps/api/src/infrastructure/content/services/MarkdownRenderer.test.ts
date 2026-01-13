import { describe, it, expect } from 'vitest';
import { MarkdownRenderer } from './MarkdownRenderer';

describe('MarkdownRenderer', () => {
  it('должен возвращать пустую строку для пустого markdown', async () => {
    const renderer = new MarkdownRenderer();
    await expect(renderer.render('')).resolves.toBe('');
    await expect(renderer.render('   ')).resolves.toBe('');
  });

  it('должен рендерить базовый markdown в HTML', async () => {
    const renderer = new MarkdownRenderer();
    const html = await renderer.render('# Заголовок\n\nТекст **жирный**');
    expect(html).toContain('<h1');
    expect(html).toContain('Заголовок');
    expect(html.toLowerCase()).toContain('<strong>');
  });
});

