import { describe, expect, it } from 'vitest';
import { readEnv } from './env.js';

describe('readEnv', () => {
  it('requires BOT_TOKEN', () => {
    expect(() => readEnv({})).toThrow(/BOT_TOKEN/);
  });
});
