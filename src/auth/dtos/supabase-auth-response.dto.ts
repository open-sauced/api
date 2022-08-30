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
}
