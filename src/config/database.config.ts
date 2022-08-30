import { registerAs } from "@nestjs/config";

export default registerAs("db", () => ({
  connection: String(process.env.TYPEORM_CONNECTION ?? "postgres"),
  host: String(process.env.TYPEORM_HOST ?? "localhost"),
  port: String(process.env.TYPEORM_PORT ?? "5432"),
  username: String(process.env.TYPEORM_USERNAME ?? "ospz-local"),
  password: String(process.env.TYPEORM_PASSWORD ?? "UCN2zrH2WGxKck7tT2JG4MY6wbHkeX9s"),
  database: String(process.env.TYPEORM_DATABASE ?? "ospz-local"),
}));
