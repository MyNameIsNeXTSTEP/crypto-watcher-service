INSERT INTO watcher_links (user_id, payload_hash, expires_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  decode('3d9dbcbd75341cfbdfd40b1f68353627d5822fcc779ff085d576a1f202717b67', 'hex'),
  NOW() + INTERVAL '1 year'
);

INSERT INTO workers (user_id, name, last_seen_at, hashrate_mh, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'worker1', NOW(), 1000.000, 'online');
