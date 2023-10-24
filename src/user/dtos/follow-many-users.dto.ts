import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class FollowManyUsersDto {
  @ApiProperty({
    description: "An array of usernames  to follow",
    example: ["jpmcb", "bdougie", "brandonroberts"],
    type: "string",
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  public usernames: string[];
}
