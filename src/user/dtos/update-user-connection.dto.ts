import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

export class UpdateUserConnectionDto {
  @ApiProperty({
    description: "Connection Request Status",
    type: String,
    example: "accept",
  })
  @IsString()
  @IsIn(["accept", "ignore"])
  status: string;
}
