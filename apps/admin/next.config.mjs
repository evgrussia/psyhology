import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next иногда “угадывает” корень воркспейса по чужим lockfile в системе.
  // Явно фиксируем корень на уровне репозитория.
  outputFileTracingRoot: join(__dirname, '../..'),
};

export default nextConfig;
