import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { SupabaseAuthUser } from "nestjs-supabase-auth";

export type SupabaseAuthRequest = Partial<Request> & { user?: SupabaseAuthUser };

export const User = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<SupabaseAuthRequest>();

  return request.user;
});

export const UserId = createParamDecorator((_data: unknown, context: ExecutionContext): number => {
  const request = context.switchToHttp().getRequest<SupabaseAuthRequest>();

  return parseInt(request.user?.user_metadata.sub as string, 10);
});

export const OptionalUserId = createParamDecorator((_data: unknown, context: ExecutionContext): number | undefined => {
  const request = context.switchToHttp().getRequest<SupabaseAuthRequest>();

  if (!request.user) {
    return undefined;
  }

  return parseInt(request.user.user_metadata.sub as string, 10);
});
