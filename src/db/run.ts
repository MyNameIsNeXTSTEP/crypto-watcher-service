import 'dotenv/config';
import { readFileSync } from 'fs';
import { Client } from 'pg';

type TRunType = 'migrate' | 'seed';

const run = async (type: TRunType, file: string) => {
  const sql = readFileSync(file).toString();
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    await client.query(sql);
    await client.end();
    console.log(`${type} ${file} completed successfully`);
  } catch (error) {
    console.error(error);
    console.error(`${type} ${file} failed`);
    process.exit(1);
  }
};

/**
 * @note
 * Для seeding используем команду в терминале:
 * ```bash
 * npx tsx src/db/run.ts ${type: 'migrate' | 'seed'} src/db/FOLDER/FILE.sql`
 * ```
 */
run(process.argv[2] as TRunType, process.argv[3] || '').catch(console.error);
