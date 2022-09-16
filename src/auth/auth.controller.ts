import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { execSync } from "child_process";
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
  ): Promise<SupabaseAuthDto & { is_onboarded: boolean }> {
    const { role, email, confirmed_at, last_sign_in_at, created_at, updated_at, user_metadata: { sub: id, user_name } } = user;

    let onboarded = false;

    // check/insert user
    try {
      // get user from public users table
      const { is_onboarded } = await this.userService.checkAddUser(user);

      onboarded = is_onboarded;
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

  @Post("/onboarding/repos")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "postOnboardingRepos",
    summary: "Retrieves onboarding repos using a PAT",
  })
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  postOnboardingRepos (
    @Body() body: string,
  ): string[] {
    const { token } = JSON.parse(body || "{}") as { token: string | undefined };

    if (!token) {
      throw (new NotFoundException);
    }

    try {
      const repoList = execSync(`npx repo-report ls --token="${token}"`).toString("utf-8");
      const repos = repoList.split(/\n/).filter(repo => repo !== "");

      return repos;
    } catch (e) {
      throw (new NotFoundException);
    }
  }
}
