import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class UserOnboardingDto {
  @ApiProperty({
    description: "An array of interests",
    type: "string",
    isArray: true,
    example: ["javascript", "react"],
  })
  @IsArray()
  public interests: string[];

  @ApiProperty({
    description: "User timezone in UTC",
    type: String,
    example: "UTC-5",
  })
  @IsString()
  public timezone: string;
}
