import { registerAs } from "@nestjs/config";

export default registerAs("api", () => ({
  host: String(process.env.API_HOST ?? "0.0.0.0"),
  port: String(process.env.API_PORT ?? "3001"),
  domain: String(process.env.API_DOMAIN ?? "api.opensauced.pizza"),
  development: String(process.env.npm_lifecycle_script ?? "node").includes("watch"),
  memory_heap: Number(parseInt(process.env.MEMORY_HEAP ?? "200", 10) * 1024 * 1024),
  memory_rss: Number(parseInt(process.env.MEMORY_RSS ?? "3000", 10) * 1024 * 1024),
  disk_percentage: Number(parseFloat(process.env.DISK_PERCENGATE ?? "0.7")),
  disk_size: Number(parseInt(process.env.DISK_SIZE ?? "100", 10) * 1024 * 1024 * 1024),
}));
