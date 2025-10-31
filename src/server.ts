import { config } from 'dotenv';
import Fastify, { type FastifyInstance } from 'fastify';
import { dbPlugin, rateLimitPlugin } from '@plugins/index.js';
import publicRoutes from "@routes/public.js";
import { __dirname } from 'src/system.js';

config({ path: __dirname + `/.env` });
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

export async function buildServer(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
      level: process.env.LOG_LEVEL || "info",
      serializers: {
        req(request) {
          return {
            method: request.method,
            url: request.url,
            headers: request.headers,
            remoteAddress: request.ip,
            remotePort: request.socket.remotePort || 0,
          };
        },
      },
    },
    requestIdLogLabel: 'request_id',
    disableRequestLogging: false,
    ajv: {
      customOptions: {
        removeAdditional: 'all',
        coerceTypes: true,
        useDefaults: true,
      },
    },
  });

  await app.register(dbPlugin);
  await app.register(rateLimitPlugin);
  await app.register(publicRoutes, { prefix: '/public' });

  return app as FastifyInstance;
};

const startServer = async () => {
  const server = await buildServer();
  try {
    await server.listen({ port, host });
    process.on('SIGINT', async () => {
      console.warn('\nClosing the server by a SIGINT\n');
      await server.close();
      process.exit(0);
    });
    process.on('SIGTERM', async () => {
      console.warn('\nClosing the server by a SIGTERM\n');
      await server.close();
      process.exit(1);
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

startServer();
