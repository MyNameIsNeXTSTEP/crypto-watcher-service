import { type TDbConnection } from '@db';
import { WatcherRepository } from '@db/repo.js';

declare module 'fastify' {
  export interface FastifyInstance<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    HttpServer = Server,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    HttpRequest = IncomingMessage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    HttpResponse = ServerResponse
  > {
    db: {
      watcherRepository: WatcherRepository;
    };
  }
};
