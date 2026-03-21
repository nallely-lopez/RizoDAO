import path from 'path'
import { defineConfig } from 'prisma/config'

const DATABASE_URL = process.env.DATABASE_URL ?? 
  "postgresql://neondb_owner:npg_5FsCWyLdJ2PH@ep-dark-firefly-aaclhb6g-pooler.westus3.azure.neon.tech/neondb?sslmode=require&channel_binding=require"

export default defineConfig({
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  migrate: {
    adapter: async () => {
      const { PrismaNeon } = await import('@prisma/adapter-neon')
      const { Pool } = await import('@neondatabase/serverless')
      const pool = new Pool({ connectionString: DATABASE_URL })
      return new PrismaNeon(pool)
    },
  },
})
