import { type Static, Type } from '@sinclair/typebox';

export const DashboardRequestParamsSchema = Type.Object({
  token: Type.String({
    minLength: 20,
    maxLength: 50,
    description: 'Base58Check encoded token',
  }),
});

export const WorkerResponseSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String(),
  status: Type.Union([
    Type.Literal('online'),
    Type.Literal('offline'),
    Type.Literal('inactive'),
  ]),
  last_seen_at: Type.String({ format: 'date-time' }),
  hashrate_th: Type.String({
    pattern: '^\\d+\\.\\d{3}$',
    description: 'Hashrate in TH/s with 3 decimals',
  }),
});

export const AggregatesSchema = Type.Object({
  online: Type.Integer({ minimum: 0 }),
  offline: Type.Integer({ minimum: 0 }),
  inactive: Type.Integer({ minimum: 0 }),
  total_hashrate_th: Type.String({ pattern: '^\\d+\\.\\d{3}$' }),
});

export const DashboardResponseSchema = Type.Object({
  workers: Type.Array(WorkerResponseSchema),
  agg: AggregatesSchema,
});

export const ErrorSchema = Type.Object({
  error: Type.String(),
});

export type DashboardRequestParamsType = Static<typeof DashboardRequestParamsSchema>;
export type DashboardResponseType = Static<typeof DashboardResponseSchema>;
export type WorkerResponseType = Static<typeof WorkerResponseSchema>;
export type ErrorResponseType = Static<typeof ErrorSchema>;