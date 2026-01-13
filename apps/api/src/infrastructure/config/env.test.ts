import { describe, expect, it } from 'vitest';
import { readEnv } from './env.js';

describe('readEnv', () => {
  it('applies defaults', () => {
    const env = readEnv({});
    expect(env.PORT).toBe(3001);
    expect(env.COMMIT_SHA).toBe('dev');
    expect(env.NODE_ENV).toBe('development');
  });

  it('rejects invalid port', () => {
    expect(() => readEnv({ PORT: '99999' })).toThrow(/Invalid environment variables/);
  });
});
