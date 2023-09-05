import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

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
}
