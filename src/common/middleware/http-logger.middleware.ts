import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { clc } from "@nestjs/common/utils/cli-colors.util";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);

  use (request: Request, response: Response, next: NextFunction) {
    const startTime = Date.now();
    const getDuration = (text: string) => `${text} ${clc.yellow(`+${String(Date.now() - startTime)}ms`)}`;

    response.on("finish", () => {
      const { method, originalUrl } = request;
      const { statusCode, statusMessage } = response;

      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage}`;

      if (statusCode >= 500) {
        return this.logger.error(getDuration(clc.red(message)));
      }

      if (statusCode >= 400) {
        return this.logger.warn(getDuration(clc.magentaBright(message)));
      }

      return this.logger.log(getDuration(message));
    });

    next();
  }
}

export default HttpLoggerMiddleware;
