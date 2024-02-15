import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray } from "class-validator";
import { Contributor } from "./create-user-list.dto";

export class CollaboratorsDto {
  @ApiProperty({
    description: "An array of contributor user IDs",
    isArray: true,
    type: "integer",
    example: [42211, 81233],
  })
  @IsArray()
  @Type(() => Contributor)
  contributors: { id: number; login?: string }[];
}
