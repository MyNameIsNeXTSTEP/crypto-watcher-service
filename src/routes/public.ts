import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
import {
  DashboardRequestParamsSchema,
  DashboardResponseSchema,
  WorkerResponseSchema,
  ErrorSchema,
  HealthzResponseSchema,
  type DashboardRequestParamsType,
  NullSchema,
} from './schemas/index.js';
import { TokenManager } from '@utils/token.js';
import { ETagGenerator } from '@utils/etag.js';

const publicRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    '/w/:token/dashboard',
    {
      schema: {
        params: DashboardRequestParamsSchema,
        response: {
          200: DashboardResponseSchema,
          404: ErrorSchema,
          304: NullSchema,
          429: ErrorSchema,
        },
        tags: ['public'],
        description: 'Get dashboard data by watcher token',
      },
      config: {
        rateLimit: {
          max: 30,
          timeWindow: '1 minute',
          // @ts-expect-error - FastifyRequest is not typed correctly
          keyGenerator: (req: FastifyRequest) => req.params.token,
        },
      },
    },
    async (request, reply) => {
      const { token } = request.params as DashboardRequestParamsType;
      const tokenManager = new TokenManager();
      const etagGenerator = new ETagGenerator();

      const payloadHash = tokenManager.verify(token);
      if (!payloadHash) return reply.code(404).send({ error: 'Not found' });

      const userId = await app.db.watcherRepository.getUserIdByPayloadHash(payloadHash);
      if (!userId) return reply.code(404).send({ error: 'Not found' });

      const workers = await app.db.watcherRepository.getWorkersForUser(userId);
      const agg = {
        online: workers.filter((w) => w.status === 'online').length,
        offline: workers.filter((w) => w.status === 'offline').length,
        inactive: workers.filter((w) => w.status === 'inactive').length,
        total_hashrate_th: workers.reduce((acc, w) => acc + parseFloat(w.hashrate_th), 0).toFixed(3),
      };

      const response = { workers, agg };
      const etag = etagGenerator.generate(response);

      if (request.headers['if-none-match'] === etag)
        return reply.code(304).send();
      reply.header('ETag', etag);
      return reply.send(response);
    }
  );

  app.get(
    '/healthz',
    {
      schema: {
        response: {
          200: HealthzResponseSchema,
          503: HealthzResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const response = await app.db.watcherRepository.healthCheck();
      reply.code(response.status === 'error' ? 503 : 200);
      return response;
    }
  );
};

export default publicRoutes;
