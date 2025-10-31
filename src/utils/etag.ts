import crypto from 'crypto';
import type { DashboardResponseType } from '@routes/schemas/index.js';

export class ETagGenerator {
  private normalizeTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const minutes = Math.floor(date.getTime() / 60000);
    return new Date(minutes * 60000).toISOString();
  };

  private canonicalize(data: DashboardResponseType): string {
    const normalized = {
      workers: data.workers.map((w) => ({
        hashrate_th: w.hashrate_th,
        id: w.id,
        last_seen_at: this.normalizeTimestamp(w.last_seen_at),
        name: w.name,
        status: w.status,
      })),
      agg: {
        inactive: data.agg.inactive,
        offline: data.agg.offline,
        online: data.agg.online,
        total_hashrate_th: data.agg.total_hashrate_th,
      },
    };
    return JSON.stringify(normalized);
  };

  generate(data: DashboardResponseType): string {
    const canonical = this.canonicalize(data);
    return crypto.createHash('sha256').update(canonical).digest('hex');
  };
};
