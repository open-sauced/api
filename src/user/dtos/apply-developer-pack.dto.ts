import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ApplyDeveloperPackDto {
  @ApiProperty({
    description: "Token",
    type: String,
    example: "token",
  })
  @IsString()
  token: string;
}
