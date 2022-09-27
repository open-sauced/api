import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SupabaseGuard } from "./supabase.guard";
import { SupabaseAuthUser } from "nestjs-supabase-auth";
import { User } from "./supabase.user.decorator";
import { SupabaseAuthDto } from "./dtos/supabase-auth-response.dto";
import { UserService } from "../user/user.service";

@Controller("auth")
@ApiTags("Authentication service")
export class AuthController {
  constructor (private userService: UserService) {}

  @Get("/session")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "checkAuthSession",
    summary: "Get authenticated session information",
  })
  @ApiOkResponse({ type: SupabaseAuthDto })
  @HttpCode(HttpStatus.OK)
  async getSession (
    @User() user: SupabaseAuthUser,
  ): Promise<SupabaseAuthDto & { is_onboarded: boolean, insights_role: number }> {
    const { role, email, confirmed_at, last_sign_in_at, created_at, updated_at, user_metadata: { sub: id, user_name } } = user;

    let onboarded = false;
    let insights_role = 10;

    // check/insert user
    try {
      // get user from public users table
      const { is_onboarded, role: insights_role_id } = await this.userService.checkAddUser(user);

      onboarded = is_onboarded;
      insights_role = insights_role_id;
    } catch (e) {
      // leave onboarded as-is
    }

    return {
      id: `${String(id)}`,
      user_name: `${String(user_name)}`,
      role,
      email,
      confirmed_at,
      last_sign_in_at,
      created_at,
      updated_at,
      is_onboarded: onboarded,
      insights_role,
    };
  }

  @Post("/onboarding")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "postOnboarding",
    summary: "Updates onboarding information for user",
  })
  @ApiOkResponse({ type: SupabaseAuthDto })
  async postOnboarding (
    @User() user: SupabaseAuthUser,
  ): Promise<SupabaseAuthDto> {
    const { user_metadata: { sub: id } } = user;

    try {
      await this.userService.updateOnboarding(id as number);
    } catch (e) {
      // handle error
    }

    return user;
  }
}
