import type { FastifyPluginAsync } from 'fastify';
import {
  DashboardRequestParamsSchema,
  DashboardResponseSchema,
  WorkerResponseSchema,
  ErrorSchema,
  type DashboardRequestParamsType,
} from './schemas/index.js';

const publicRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    '/w/:token/dashboard',
    {
      schema: {
        params: DashboardRequestParamsSchema,
        response: {
          200: DashboardResponseSchema,
          404: ErrorSchema,
          304: null,
          429: ErrorSchema,
        },
        tags: ['public'],
        description: 'Get dashboard data by watcher token'
      },
      config: {
        rateLimit: {
          max: 30,
          timeWindow: '1 minute',
          // keyGenerator: (req) => req.params.token,
        },
      },
    },
    async (request, reply) => {
      const { token } = request.params as DashboardRequestParamsType;
      // 1. getting payload hash from token
      // 2. getting user id from payload hash
      // 3. getting workers for user
      // 4. getting aggregates for user
      // 5. returning response
    }
  );

  app.get('/healthz', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' }
          }
        },
        503: {
          type: 'object',
          properties: {
            status: { type: 'string' }
          }
        }
      },
    },
  }, async (request, reply) => {
    const isHealthy = await app.db.watcherRepository.healthCheck();
    if (!isHealthy) {
      reply.code(503);
      return { status: 'error' };
    }
    return { status: 'ok' };
  });
};

export default publicRoutes;
