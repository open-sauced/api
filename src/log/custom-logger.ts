import { Injectable, ConsoleLogger } from "@nestjs/common";
import { ConsoleLoggerOptions } from "@nestjs/common/services/console-logger.service";
import { ConfigService } from "@nestjs/config";
import { LogService } from "./log.service";

@Injectable()
class CustomLogger extends ConsoleLogger {
  private readonly logsService: LogService;

  constructor(context: string, options: ConsoleLoggerOptions, configService: ConfigService, logsService: LogService) {
    super(context, {
      ...options,
      logLevels: ["error", "warn", "log", "verbose", "debug"],
    });

    this.logsService = logsService;
  }

  async log(message: string, context?: string) {
    super.log.apply(this, [message, context]);

    return this.logsService.createLog({
      message,
      context,
      level: "log",
    });
  }

  async error(message: string, stack?: string, context?: string) {
    super.error.apply(this, [message, stack, context]);

    return this.logsService.createLog({
      message,
      context,
      level: "error",
    });
  }

  async warn(message: string, context?: string) {
    super.warn.apply(this, [message, context]);

    return this.logsService.createLog({
      message,
      context,
      level: "error",
    });
  }

  async debug(message: string, context?: string) {
    super.debug.apply(this, [message, context]);

    return this.logsService.createLog({
      message,
      context,
      level: "error",
    });
  }

  async verbose(message: string, context?: string) {
    super.debug.apply(this, [message, context]);

    return this.logsService.createLog({
      message,
      context,
      level: "error",
    });
  }
}

export default CustomLogger;
