import '@/drizzle/envConfig';
import { defineConfig } from 'drizzle-kit';

if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL environment variable is not defined');
  }
 
export default defineConfig({
  schema: './server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL || 'postgres://localhost:5432/drizzle',
  },
});

