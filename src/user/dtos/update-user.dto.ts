import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    description: "User Profile Email",
    type: String,
    example: "hello@opensauced.pizza",
  })
  @IsEmail()
  public email: string;

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
}
