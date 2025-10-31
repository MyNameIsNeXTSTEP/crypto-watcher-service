import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";
import type { FastifyRequest } from "fastify";

export default fp(async (fastify) => {
  await fastify.register(rateLimit, {
    global: false,
    max: 30,
    timeWindow: "1 minute",
    keyGenerator: (request: FastifyRequest) => {
      return (request.params as { token: string }).token || 'unknown';
    },
    errorResponseBuilder: (request, context) => {
      return {
        error: "Too many requests",
        limit: context.max,
        remaining: context.after,
      };
    },
    skipOnError: false,
  });
});
