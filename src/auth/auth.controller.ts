import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SupabaseGuard } from "./supabase.guard";
import { SupabaseAuthUser } from "nestjs-supabase-auth";
import { User, UserId } from "./supabase.user.decorator";
import { SupabaseAuthDto } from "./dtos/supabase-auth-response.dto";
import { UserService } from "../user/user.service";
import { UserReposService } from "../user-repo/user-repos.service";
import { StripeService } from "../stripe/stripe.service";
import { CustomerService } from "../customer/customer.service";
import { DbUser } from "../user/user.entity";
import { UpdateUserDto } from "../user/dtos/update-user.dto";

@Controller("auth")
@ApiTags("Authentication service")
export class AuthController {
  constructor (
    private userService: UserService,
    private userReposService: UserReposService,
    private stripeService: StripeService,
    private customerService: CustomerService,
  ) {}

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
  ): Promise<SupabaseAuthDto> {
    const { role, email, confirmed_at, last_sign_in_at, created_at, updated_at, user_metadata: { sub: id, user_name } } = user;

    let userProfile = {};


    // check/insert user
    try {
      // get user from public users table
      const { is_onboarded, is_waitlisted, role: insights_role_id, name, bio, location, twitter_username, company } = await this.userService.checkAddUser(user);

      userProfile = { is_onboarded, insights_role_id, is_waitlisted, name, location, bio, twitter_username, company };
    } catch (e) {
      // leave user profile as-is
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
      ...userProfile,
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
  @ApiNotFoundResponse({ description: "Unable to update onboarding information for the user" })
  async postOnboarding (
    @UserId() userId: number,
      @Body() body: string,
  ): Promise<void> {
    const data = JSON.parse(body) as { ids: number[] } | null;

    if (data && Array.isArray(data.ids)) {
      const repoIds = data.ids;

      repoIds.forEach(async repoId => {
        await this.userReposService.addUserRepo(userId, repoId);
      });
    }

    return this.userService.updateOnboarding(userId);
  }

  @Post("/waitlist")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "postWaitlist",
    summary: "Updates waitlist information for user",
  })
  @ApiOkResponse({ type: SupabaseAuthDto })
  @ApiNotFoundResponse({ description: "Unable to update waitlist information for the user" })
  async postWaitlist (
    @UserId() userId: number,
  ): Promise<void> {
    return this.userService.updateWaitlistStatus(userId);
  }

  @Post("/checkout/session")
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOperation({
    operationId: "postCreateCheckoutSession",
    summary: "Creates a new checkout session for the user",
  })
  @ApiOkResponse({ type: SupabaseAuthDto })
  @ApiNotFoundResponse({ description: "Unable to create checkout session" })
  async postCreateCheckoutSession (
    @User() user: SupabaseAuthUser,
  ): Promise<{ sessionId: string }> {
    const { email, user_metadata: { sub } } = user;
    const id = sub as number;
    const customer = await this.customerService.findById(id);
    let customerId: string;

    if (customer) {
      customerId = customer.stripe_customer_id;
    } else {
      const stripeCustomer = await this.stripeService.addCustomer(id, email);
      const newCustomer = await this.customerService.addCustomer(id, stripeCustomer.id);

      customerId = newCustomer.stripe_customer_id;
    }

    return this.stripeService.createCheckoutSession(customerId);
  }

  @Patch("/profile")
  @ApiOperation({
    operationId: "updateProfileForUser",
    summary: "Updates the profile for the authenticated user",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUser })
  @ApiNotFoundResponse({ description: "Unable to update user profile" })
  @ApiBody({ type: UpdateUserDto })
  async updateProfileForUser (
    @UserId() userId: number,
      @Body() updateUserDto: UpdateUserDto,
  ): Promise<DbUser> {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Patch("/profil/interests")
  @ApiOperation({
    operationId: "updateInterestsForUserProfile",
    summary: "Updates the interests for the authenticated user profile",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiOkResponse({ type: DbUser })
  @ApiNotFoundResponse({ description: "Unable to update interests for the user profile" })
  @ApiBody({ type: UpdateUserDto })
  async updateInterestsForUserProfile (
    @UserId() userId: number,
      @Body() updateUserDto: UpdateUserDto,
  ): Promise<DbUser> {
    await this.userService.updateInterests(userId, updateUserDto);

    return this.userService.findOneById(userId);
  }
}
