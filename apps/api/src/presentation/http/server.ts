import 'dotenv/config';
import { readEnv } from '../../infrastructure/config/env.js';
import { createApp } from './app.js';

async function main() {
  const env = readEnv(process.env);

  const app = createApp({ commitSha: env.COMMIT_SHA });

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exitCode = 1;
  }
}

void main();
