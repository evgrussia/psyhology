import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  COMMIT_SHA: z.string().min(1).default('dev'),
  // В релизе 1 будет обязательной, но каркас API должен стартовать без БД.
  DATABASE_URL: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;

export function readEnv(raw: NodeJS.ProcessEnv): Env {
  const parsed = envSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((i) => `${i.path.join('.') || 'env'}: ${i.message}`)
      .join('; ');
    throw new Error(`Invalid environment variables: ${message}`);
  }
  return parsed.data;
}
