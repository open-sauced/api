import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { clc } from "@nestjs/common/utils/cli-colors.util";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use (request: Request, response: Response, next: NextFunction) {
    response.on("finish", () => {
      const { method, originalUrl } = request;
      const { statusCode, statusMessage } = response;

      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage}`;

      if (statusCode >= 500) {
        return this.logger.error(clc.red(message));
      }

      if (statusCode >= 400) {
        return this.logger.warn(clc.magentaBright(message));
      }

      return this.logger.log(message);
    });

    next();
  }
}

export default HttpLoggerMiddleware;
