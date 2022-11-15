import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class CreateInsightDto {
  @ApiProperty({
    description: "Insight Page Name",
    type: String,
    example: "My Team",
  })
  @IsString()
    name: string;

  @ApiProperty({
    description: "An array of repository IDs",
    type: [Number],
    isArray: true,
    example: [1, 2, 3],
  })
  @IsArray()
    ids: number[];
}
