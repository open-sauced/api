import { SetMetadata, applyDecorators } from "@nestjs/common";

export const DEPRECATED = "DEPRECATED";

export function Deprecated(message?: string) {
  return applyDecorators(SetMetadata(DEPRECATED, message ?? "This route is deprecated"));
}
