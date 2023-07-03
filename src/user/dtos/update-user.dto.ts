import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, IsUrl, Matches } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    description: "User Profile Name",
    type: String,
    example: "Pizza Maker",
  })
  @IsString()
  public name: string;

  @ApiProperty({
    description: "User Profile Email",
    type: String,
    example: "hello@opensauced.pizza",
  })
  @IsEmail()
  public email: string;

  @ApiPropertyOptional({
    description: "User Profile Bio",
    type: String,
    example: "I make the pizza",
  })
  @IsString()
  @IsOptional()
  public bio?: string;

  @ApiPropertyOptional({
    description: "User Profile URL",
    type: String,
    example: "https://opensauced.pizza",
  })
  @IsUrl()
  @IsOptional()
  public url?: string;

  @ApiPropertyOptional({
    description: "User Profile Twitter Username",
    type: String,
    example: "saucedopen",
  })
  @IsString()
  @Matches(/^(?!.*?admin)(?!.*?twitter)\w{0,15}$/i, {
    message:
      "Twitter username can only contain letters, numbers, and underscores. It also cannot contain reserved Twitter usernames (twitter or admin).",
  })
  @IsOptional()
  public twitter_username?: string;

  @ApiPropertyOptional({
    description: "User Profile Company",
    type: String,
    example: "OpenSauced",
  })
  @IsString()
  @IsOptional()
  public company?: string;

  @ApiPropertyOptional({
    description: "User Profile Location",
    type: String,
    example: "OpenSauced",
  })
  @IsString()
  @IsOptional()
  public location?: string;

  @ApiPropertyOptional({
    description: "Display user local time in profile",
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  public display_local_time?: boolean;

  @ApiPropertyOptional({
    description: "User timezone in UTC",
    type: String,
    example: "UTC-5",
  })
  @IsString()
  @IsOptional()
  public timezone?: string;

  @ApiPropertyOptional({
    description: "LinkedIn URL",
    example: "https://www.linkedin.com/in/brianldouglas",
  })
  @IsUrl()
  @IsOptional()
  readonly linkedin_url?: string;

  @ApiPropertyOptional({
    description: "GitHub Sponsors URL",
    example: "https://github.com/sponsors/open-sauced",
  })
  @IsUrl()
  @IsOptional()
  readonly github_sponsors_url?: string;
}
