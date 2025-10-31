import fp from 'fastify-plugin';
import { pool } from '@db/index.js';
import { WatcherRepository } from '@db/repo.js';

export default fp(async (fastify) => {
  fastify.decorate('db', {
    watcherRepository: new WatcherRepository(pool),
  });
});
