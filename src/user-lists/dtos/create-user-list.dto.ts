import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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

  @ApiPropertyOptional({
    description: "An array of contributor objects",
    isArray: true,
    example: [{ id: 12345, login: "sauceduser" }],
  })
  @IsArray()
  contributors: { id: number; login: string }[];
}
