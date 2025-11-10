import { config as dotenvConfig } from "dotenv";
// Load only .env (user requested single source)
dotenvConfig({ path: ".env" });
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL!, // use process.env for env variables
  },
});
