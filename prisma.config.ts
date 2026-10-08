import { config } from 'dotenv';
config({ path: '.env.local' });
config(); // fallback to .env

import { env, defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
    directUrl: env('DATABASE_URL_UNPOOLED'),
  } as { url: string; directUrl: string; shadowDatabaseUrl?: string },
});
