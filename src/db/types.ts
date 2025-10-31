export interface IDatabase {
  watcher_links: IWatcherLinksTable;
  workers: IWorkersTable;
}

export interface IWatcherLinksTable {
  id: string;
  user_id: string;
  payload_hash: Buffer;
  scope: string;
  expires_at: Date | string;
  revoked_at: Date | string | null;
  created_at: Date | string;
}

export interface IWorkersTable {
  id: string;
  user_id: string;
  name: string;
  last_seen_at: Date | string;
  hashrate_mh: number;
  status: 'online' | 'offline' | 'inactive';
}
