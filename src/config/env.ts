import * as dotenv from "dotenv";
import { z } from "zod";
import process from "process";

dotenv.config();

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required"),
  GOOGLE_REDIRECT_URI: z.string().default("http://localhost"),
  GOOGLE_REFRESH_TOKEN: z.string().optional(),
});

export function getConfig() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment configuration:", parsed.error.format());
    process.exit(1);
  }
  return parsed.data;
}

export const config = getConfig();
