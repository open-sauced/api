import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsString } from "class-validator";

export class CreateUserListDto {
  @ApiProperty({
    description: "List Name",
    type: String,
    example: "My List",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "List Visibility",
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  is_public: boolean;

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
