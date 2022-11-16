import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsString } from "class-validator";

export class CreateInsightDto {
  @ApiProperty({
    description: "Insight Page Name",
    type: String,
    example: "My Team",
  })
  @IsString()
    name: string;

  @ApiProperty({
    description: "Insight Page Visibility",
    type: Boolean,
    example: false,
  })
  @IsBoolean()
    is_public: boolean;

  @ApiProperty({
    description: "An array of repository IDs",
    type: [Number],
    isArray: true,
    example: [1, 2, 3],
  })
  @IsArray()
    ids: number[];
}
