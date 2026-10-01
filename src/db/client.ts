import 'server-only';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { z } from 'zod';
let database: ReturnType<typeof drizzle> | undefined;
export function db() {
  if (!database) {
    const url = z.string().min(1).parse(process.env.DATABASE_URL);
    database = drizzle(
      postgres(url, {
        prepare: false,
        max: 5,
        connect_timeout: 10,
        idle_timeout: 20,
        connection: {
          statement_timeout: 15000,
          idle_in_transaction_session_timeout: 90000,
        },
      }),
    );
  }
  return database;
}
