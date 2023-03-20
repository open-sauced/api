import { registerAs } from "@nestjs/config";

export const DbApiConfig = registerAs("db-api", () => ({
  connection: String(process.env.TYPEORM_CONNECTION_API ?? "postgres"),
  host: String(process.env.TYPEORM_HOST_API ?? "localhost"),
  port: String(process.env.TYPEORM_PORT_API ?? "5432"),
  username: String(process.env.TYPEORM_USERNAME_API ?? "ospz-local"),
  password: String(process.env.TYPEORM_PASSWORD_API ?? "UCN2zrH2WGxKck7tT2JG4MY6wbHkeX9s"),
  database: String(process.env.TYPEORM_DATABASE_API ?? "ospz-postgres"),
  certificate: String(process.env.TYPEORM_SSL_CERT_API ?? "-----------------------------"),
  maxQueryExecutionTime: Number(parseInt(process.env.TYPEORM_MAX_QUERY_EXECUTION_TIME_API ?? "2000", 10)),
}));

export default DbApiConfig;
