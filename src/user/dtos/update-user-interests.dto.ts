import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class UpdateUserProfileInterestsDto {
  @ApiProperty({
    description: "An array of interests",
    type: "string",
    isArray: true,
    example: ["javascript", "react"],
  })
  @IsArray()
  public interests: string[];
}
