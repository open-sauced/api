import { registerAs } from "@nestjs/config";

export const ApiConfig = registerAs("api", () => ({
  codename: String(process.env.API_CODENAME ?? "api-local"),
  logging: process.env.NODE_ENV !== "production" ? "debug" : "info",
  host: String(process.env.API_HOST ?? "0.0.0.0"),
  port: String(process.env.API_PORT ?? "3001"),
  domain: String(process.env.API_DOMAIN ?? "api.opensauced.pizza"),
  development: !process.env.CI,
  memory_heap: Number(parseInt(process.env.MEMORY_HEAP ?? "200", 10) * 1024 * 1024),
  memory_rss: Number(parseInt(process.env.MEMORY_RSS ?? "3000", 10) * 1024 * 1024),
  disk_percentage: Number(parseFloat(process.env.DISK_PERCENGATE ?? "0.7")),
  disk_size: Number(parseInt(process.env.DISK_SIZE ?? "100", 10) * 1024 * 1024 * 1024),
  endorsementServiceToken: String(process.env.ENDORSEMENT_SERVICE_TOKEN ?? ""),
}));

export default ApiConfig;
