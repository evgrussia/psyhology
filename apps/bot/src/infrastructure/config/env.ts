import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  COMMIT_SHA: z.string().min(1).default('dev'),
  BOT_TOKEN: z.string().min(1),
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
