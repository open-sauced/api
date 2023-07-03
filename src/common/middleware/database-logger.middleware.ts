import { Logger as TypeOrmLogger, QueryRunner } from "typeorm";
import { Logger as NestLogger } from "@nestjs/common";
import { clc } from "@nestjs/common/utils/cli-colors.util";

export class DatabaseLoggerMiddleware implements TypeOrmLogger {
  private readonly logger;

  constructor(name = "SQL") {
    this.logger = new NestLogger(name);
  }

  logQuery(query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    if (queryRunner?.data.isCreatingLogs) {
      return;
    }

    this.logger.log(`${query} -- Parameters: ${this.stringifyParameters(parameters)}`);
  }

  logQueryError(error: string, query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    if (queryRunner?.data.isCreatingLogs) {
      return;
    }

    this.logger.error(`${query} -- Parameters: ${this.stringifyParameters(parameters)} -- ${error}`);
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    if (queryRunner?.data.isCreatingLogs) {
      return;
    }

    this.logger.error(
      `${query} -- Parameters: ${this.stringifyParameters(parameters)} ${clc.red(`+${String(time)}ms`)}`
    );
  }

  logMigration(message: string) {
    this.logger.warn(message);
  }

  logSchemaBuild(message: string) {
    this.logger.warn(message);
  }

  log(level: "log" | "info" | "warn", message: string, queryRunner?: QueryRunner) {
    if (queryRunner?.data.isCreatingLogs) {
      return;
    }

    if (level === "log") {
      return this.logger.log(message);
    }
    if (level === "info") {
      return this.logger.debug(message);
    }

    return this.logger.warn(message);
  }

  private stringifyParameters(parameters?: unknown[]) {
    try {
      return JSON.stringify(parameters);
    } catch {
      return "";
    }
  }
}

export default DatabaseLoggerMiddleware;
