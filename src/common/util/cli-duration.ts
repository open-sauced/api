import { clc } from "@nestjs/common/utils/cli-colors.util";

export const cliDuration = (startTime: number, text: string) =>
  `${text} ${clc.yellow(`+${String(Date.now() - startTime)}ms`)}`;
