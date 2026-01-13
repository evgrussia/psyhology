import { describe, it, expect } from 'vitest';
import { Slug } from './Slug';

describe('Slug (Value Object)', () => {
  it('должен создавать slug из валидной строки', () => {
    const slug = Slug.fromString('test-slug_123');
    expect(slug.getValue()).toBe('test-slug_123');
  });

  it('должен отклонять slug с пробелами/заглавными буквами', () => {
    expect(() => Slug.fromString('Test Slug')).toThrow();
    expect(() => Slug.fromString('UPPER')).toThrow();
    expect(() => Slug.fromString('with space')).toThrow();
  });

  it('должен генерировать slug из title', () => {
    const slug = Slug.fromTitle('Привет, мир! Hello World 123');
    // fromTitle делает транслитерацию/очистку (минимальная гарантия: URL-safe)
    expect(slug.getValue()).toMatch(/^[a-z0-9_-]+$/);
    expect(slug.getValue().length).toBeGreaterThan(0);
  });
});

