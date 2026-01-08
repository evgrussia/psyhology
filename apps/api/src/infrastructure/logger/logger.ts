import pino from 'pino';

export function createLogger() {
  return pino({
    level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie'],
      remove: true,
    },
  });
}
