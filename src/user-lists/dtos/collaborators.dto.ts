import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray } from "class-validator";

export class CollaboratorsDto {
  @ApiProperty({
    description: "An array of contributor user IDs",
    isArray: true,
    type: "integer",
    example: [42211, 81233],
  })
  @Type(() => Number)
  @IsArray()
  contributors: number[];
}
