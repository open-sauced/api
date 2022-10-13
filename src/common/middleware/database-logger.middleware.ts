import { Logger as TypeOrmLogger } from "typeorm";
import { Logger as NestLogger } from "@nestjs/common";
import { clc } from "@nestjs/common/utils/cli-colors.util";

export class DatabaseLoggerMiddleware implements TypeOrmLogger {
  private readonly logger = new NestLogger("SQL");

  logQuery (query: string, parameters?: unknown[]) {
    this.logger.log(`${query} -- Parameters: ${this.stringifyParameters(parameters)}`);
  }

  logQueryError (error: string, query: string, parameters?: unknown[]) {
    this.logger.error(`${query} -- Parameters: ${this.stringifyParameters(parameters)} -- ${error}`);
  }

  logQuerySlow (time: number, query: string, parameters?: unknown[]) {
    this.logger.error(`${query} -- Parameters: ${this.stringifyParameters(parameters)} ${clc.red(`+${String(time)}ms`)}`);
  }

  logMigration (message: string) {
    this.logger.warn(message);
  }

  logSchemaBuild (message: string) {
    this.logger.warn(message);
  }

  log (level: "log" | "info" | "warn", message: string) {
    if (level === "log") {
      return this.logger.log(message);
    }
    if (level === "info") {
      return this.logger.debug(message);
    }

    return this.logger.warn(message);
  }

  private stringifyParameters (parameters?: unknown[]) {
    try {
      return JSON.stringify(parameters);
    } catch {
      return "";
    }
  }
}

export default DatabaseLoggerMiddleware;
