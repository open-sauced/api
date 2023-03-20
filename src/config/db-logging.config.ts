import { registerAs } from "@nestjs/config";

export const DbLoggingConfig = registerAs("db-logging", () => ({
  connection: String(process.env.TYPEORM_CONNECTION_LOGGING ?? "postgres"),
  host: String(process.env.TYPEORM_HOST_LOGGING ?? "localhost"),
  port: String(process.env.TYPEORM_PORT_LOGGING ?? "5432"),
  username: String(process.env.TYPEORM_USERNAME_LOGGING ?? "ospz-logging"),
  password: String(process.env.TYPEORM_PASSWORD_LOGGING ?? "UCN2zrH2WGxKck7tT2JG4MY6wbHkeX9s"),
  database: String(process.env.TYPEORM_DATABASE_LOGGING ?? "ospz-logging"),
  certificate: String(process.env.TYPEORM_SSL_CERT_LOGGING ?? "-----------------------------"),
  maxQueryExecutionTime: Number(parseInt(process.env.TYPEORM_MAX_QUERY_EXECUTION_TIME_LOGGING ?? "2000", 10)),
}));

export default DbLoggingConfig;
