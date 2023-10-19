import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsString } from "class-validator";

export class Contributor {
  id: number;
  login: string;
}

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
    description: "An array of contributor objects",
    isArray: true,
    example: [{ id: 12345, login: "sauceduser" }],
  })
  @IsArray()
  @Type(() => Contributor)
  contributors: { id: number; login: string }[];
}
