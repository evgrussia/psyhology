import Fastify from 'fastify';
import { createLogger } from '../../infrastructure/logger/logger.js';
import { getVersionInfo } from '../../application/getVersion.js';

export function createApp(params: { commitSha: string }) {
  const app = Fastify({
    logger: createLogger(),
  });

  app.get('/api/health', async () => {
    return { ok: true };
  });

  app.get('/api/version', async () => {
    return getVersionInfo({ commitSha: params.commitSha });
  });

  return app;
}
