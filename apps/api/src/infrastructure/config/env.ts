import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  COMMIT_SHA: z.string().min(1).default('dev'),
  // В релизе 1 будет обязательной, но каркас API должен стартовать без БД.
  DATABASE_URL: z.string().min(1).optional(),
  // S3 Storage (Yandex Object Storage или аналог)
  S3_ENDPOINT: z.string().url().optional(),
  S3_REGION: z.string().default('ru-central1'),
  S3_ACCESS_KEY_ID: z.string().min(1).optional(),
  S3_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  S3_FORCE_PATH_STYLE: z.coerce.boolean().default(false),
  S3_CDN_URL: z.string().url().optional(),
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
