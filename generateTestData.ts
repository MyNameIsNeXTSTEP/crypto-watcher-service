import { writeFile } from 'fs';
import bs58check from "bs58check";
import crypto from "crypto";

function generateToken() {
  const payload = crypto.randomBytes(16);
  const payloadHash = crypto.createHash("sha256").update(payload).digest("hex");
  const token = bs58check.encode(payload);
  console.log("Your token and hash:\n", { token, payloadHash });
  return { token, payloadHash };
};

const { token, payloadHash } = generateToken();

const seedData = {
  user_id: '11111111-1111-1111-1111-111111111111',
  payload_hash: payloadHash,
};

console.log("Your seed data:\n", seedData);

const sql = `INSERT INTO watcher_links (user_id, payload_hash, expires_at)
VALUES (
  '${seedData.user_id}',
  decode('${seedData.payload_hash}', 'hex'),
  NOW() + INTERVAL '1 year'
);

INSERT INTO workers (user_id, name, last_seen_at, hashrate_mh, status)
VALUES
  ('${seedData.user_id}', 'worker1', NOW(), 1000.000, 'online');
`;

writeFile(`src/db/seeds/001_seed.sql`, sql, (err: any) => {
  if (err) {
    console.error("Error writing file:", err);
  } else {
    console.log("File written successfully");
  }
});
