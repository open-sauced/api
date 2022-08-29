import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SupabaseGuard } from "./supabase.guard";
import { SupabaseAuthUser } from "nestjs-supabase-auth";
import { User } from "./supabase.user.decorator";
import { SupabaseAuthResponse } from "./dtos/supabase-auth-response.dto";

@Controller("auth")
@ApiTags("Authentication service")
export class AuthController {
  @Get("/session")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "checkAuthSession",
    summary: "Get authenticated session information",
  })
  @ApiOkResponse({ type: SupabaseAuthResponse })
  @HttpCode(HttpStatus.OK)
  getHello (
    @User() user: SupabaseAuthUser,
  ): SupabaseAuthResponse {
    const { role, email, confirmed_at, last_sign_in_at, created_at, updated_at, user_metadata: { sub } } = user;

    return {
      id: `${String(sub)}`,
      role,
      email,
      confirmed_at,
      last_sign_in_at,
      created_at,
      updated_at,
    };
  }
}
