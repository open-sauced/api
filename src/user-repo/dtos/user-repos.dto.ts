import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class UserRepoOptionsDto {
  @ApiProperty({
    description: "The repos to add to onboarding",
    type: Number,
    isArray: true,
    example: [71359796, 426820139],
  })
  @IsArray()
  readonly ids: number[];
}
