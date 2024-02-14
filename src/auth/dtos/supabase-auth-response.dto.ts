import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SupabaseAuthDto {
  @ApiProperty({
    description: "Supabase authenticated unique user identifier",
    example: 237133,
  })
  readonly id: string;

  @ApiPropertyOptional({
    description: "Supabase authenticated user login name",
    example: "0-vortex",
  })
  readonly user_name?: string;

  @ApiPropertyOptional({
    description: "Supabase authenticated user role",
    example: "authenticated",
  })
  readonly role?: string;

  @ApiPropertyOptional({
    description: "Supabase authenticated user email",
    example: "vortex@opensauced.pizza",
  })
  readonly email?: string;

  @ApiPropertyOptional({
    description: "Timestamp representing supabase user registration confirmation",
    example: "2016-10-19 13:24:51.000000",
  })
  readonly confirmed_at?: string;

  @ApiPropertyOptional({
    description: "Timestamp representing supabase user last sign in",
    example: "2016-10-19 13:24:51.000000",
  })
  readonly last_sign_in_at?: string;

  @ApiPropertyOptional({
    description: "Timestamp representing supabase user creation",
    example: "2016-10-19 13:24:51.000000",
  })
  readonly created_at?: string;

  @ApiPropertyOptional({
    description: "Timestamp representing supabase user last update",
    example: "2016-10-19 13:24:51.000000",
  })
  readonly updated_at?: string;

  @ApiPropertyOptional({
    description: "Flag indicated whether the user is onboarded",
    example: false,
  })
  readonly is_onboarded?: boolean;

  @ApiPropertyOptional({
    description: "Flag indicated whether the user is waitlisted",
    example: false,
  })
  readonly is_waitlisted?: boolean;

  @ApiPropertyOptional({
    description: "Authenticated User's Insights Role",
    example: 10,
    type: "integer",
  })
  readonly insights_role?: number;

  @ApiPropertyOptional({
    description: "User bio information",
    example: "OpenSauced User",
  })
  readonly bio?: string;

  @ApiPropertyOptional({
    description: "User name information",
    example: "MrPizza",
  })
  readonly name?: string;

  @ApiPropertyOptional({
    description: "User website",
    example: "https://opensauced.pizza",
  })
  readonly url?: string;

  @ApiPropertyOptional({
    description: "User Twitter information",
    example: "saucedopen",
  })
  readonly twitter_username?: string;

  @ApiPropertyOptional({
    description: "User company information",
    example: "OpenSauced",
  })
  readonly company?: string;

  @ApiPropertyOptional({
    description: "User location information",
    example: "San Francisco, CA",
  })
  readonly location?: string;

  @ApiPropertyOptional({
    description: "User display local time information",
    example: false,
  })
  readonly display_local_time?: boolean;

  @ApiPropertyOptional({
    description: "LinkedIn URL",
    example: "https://www.linkedin.com/in/brianldouglas",
  })
  readonly linkedin_url?: string;

  @ApiPropertyOptional({
    description: "GitHub Sponsors URL",
    example: "https://github.com/sponsors/open-sauced",
  })
  readonly github_sponsors_url?: string;

  @ApiPropertyOptional({
    description: "Discord URL",
    example: "https://discord.gg/opensauced",
  })
  readonly discord_url?: string;

  @ApiPropertyOptional({
    description: "Unread User Notification Count",
    example: 5,
    type: "integer",
  })
  readonly notification_count?: number;

  @ApiPropertyOptional({
    description: "Unread Insight Pagees Count",
    example: 2,
    type: "integer",
  })
  readonly insights_count?: number;

  @ApiPropertyOptional({
    description: "Coupon Code",
    example: "saucy",
  })
  readonly coupon_code?: string;

  @ApiProperty({
    description: "Personal Workspace ID",
    example: "some-id-1234",
  })
  readonly personal_workspace_id: string;
}
