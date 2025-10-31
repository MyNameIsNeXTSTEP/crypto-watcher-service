import fp from 'fastify-plugin';
import { pool } from '@db/index.js';

export default fp(async (fastify) => {
  fastify.decorate('db', {
    pool,
  });
});
