import type { Pool } from "pg";

export class WatcherRepository {
  constructor(private readonly pool: Pool) {
    this.pool = pool;
  };

  async getUserIdByPayloadHash(payloadHash: Buffer): Promise<string | null> {
    const { rows } = await this.pool.query(`
      SELECT user_id
      FROM watcher_links
      WHERE payload_hash = $1
      AND expires_at > NOW()
      AND revoked_at IS NULL
      `,
      [payloadHash]
    );
    return rows[0]?.user_id || null;
  };

  async getWorkersForUser(userId: string) {
    const { rows } = await this.pool.query(`
      SELECT id, name, status, last_seen_at, (hashrate_mh/1000.0)::numeric(18,3) as hashrate_th
      FROM workers
      WHERE user_id = $1
      ORDER BY hashrate_th DESC, name ASC, id ASC
      `,
      [userId]
    );
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      status: row.status,
      last_seen_at: row.last_seen_at.toISOString(),
      hashrate_th: parseFloat(row.hashrate_th).toFixed(3),
    }));
  };
};
