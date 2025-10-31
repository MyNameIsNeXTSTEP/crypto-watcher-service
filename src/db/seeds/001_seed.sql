INSERT INTO watcher_links (user_id, payload_hash, expires_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  decode('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'hex'),
  NOW() + INTERVAL '1 year'
);

INSERT INTO workers (user_id, name, last_seen_at, hashrate_mh, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'worker1', NOW(), 1000.000, 'online');
