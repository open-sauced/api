import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEmail } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    description: "User Profile Email",
    type: String,
    example: "hello@opensauced.pizza",
  })
  @IsEmail()
  public email: string;

  @ApiPropertyOptional({
    description: "An array of interests",
    type: [String],
    isArray: true,
    example: ["javascript", "react"],
  })
  @IsArray()
  public interests?: string[];
}
