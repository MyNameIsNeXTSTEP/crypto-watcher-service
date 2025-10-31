import "dotenv/config";
import { readFileSync } from "fs";
import { Client } from "pg";

const run = async (file: string) => {
  const sql = readFileSync(file).toString();
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    await client.query(sql);
    await client.end();
    console.log(`Migration ${file} completed successfully`);
  } catch (error) {
    console.error(error);
    console.error(`Migration ${file} failed`);
    process.exit(1);
  }
};

/**
 * @note
 * Для миграций используем команду в терминале: `npx tsx src/db/migrate.ts src/db/migrations/001_init.sql`
 */
run(process.argv[2] || "").catch(console.error);
