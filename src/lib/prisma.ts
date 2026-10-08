import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from './generated/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString: string | undefined = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const connectionTimeoutMillis: number = Number(process.env.PRISMA_CONNECTION_TIMEOUT_MS ?? 10000);
  const idleTimeoutMillis: number = Number(process.env.PRISMA_IDLE_TIMEOUT_MS ?? 30000);
  const poolMax: number = Number(process.env.PRISMA_POOL_MAX ?? 10);

  const pool: Pool = new Pool({
    connectionString,
    max: poolMax,
    idleTimeoutMillis,
    connectionTimeoutMillis,
  });
  const adapter: PrismaPg = new PrismaPg(pool);

  return new PrismaClient({ adapter });
}

function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }
  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
}

/**
 * Prisma client (aligned with Peppercorn: Prisma 7 + `@prisma/adapter-pg` + `pg` pool, generated to `src/lib/generated`).
 * Lazily connects on first property access so modules can load without `DATABASE_URL` during `next build`.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    const value = Reflect.get(client as object, prop, client);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
