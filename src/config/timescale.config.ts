import { registerAs } from "@nestjs/config";

export const DbTimescaleConfig = registerAs("db-timescale", () => ({
  connection: String(process.env.TYPEORM_CONNECTION_TIMESCALE ?? "postgres"),
  host: String(process.env.TYPEORM_HOST_TIMESCALE ?? "localhost"),
  port: String(process.env.TYPEORM_PORT_TIMESCALE ?? "5432"),
  username: String(process.env.TYPEORM_USERNAME_TIMESCALE ?? "tsdbadmin"),
  password: String(process.env.TYPEORM_PASSWORD_TIMESCALE ?? "password"),
  database: String(process.env.TYPEORM_DATABASE_TIMESCALE ?? "tsdb"),
  certificate: String(process.env.TYPEORM_SSL_CERT_TIMESCALE ?? "-----------------------------"),
}));

export default DbTimescaleConfig;
