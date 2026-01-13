import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { InteractiveController } from '../controllers/InteractiveController.fastify';

/**
 * Регистрация роутов для интерактивов
 */
export async function registerInteractiveRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
): Promise<void> {
  const interactiveController = (fastify as any).interactiveController as InteractiveController;

  // POST /api/public/interactive/runs
  // Запуск интерактива (публичный, без авторизации)
  fastify.post('/api/public/interactive/runs', async (_request, _reply) => {
    await interactiveController.startRun(_request, _reply);
  });

  // POST /api/public/interactive/runs/:runId/complete
  // Завершение интерактива (публичный, без авторизации)
  fastify.post('/api/public/interactive/runs/:runId/complete', async (_request, _reply) => {
    await interactiveController.completeRun(_request, _reply);
  });
}
