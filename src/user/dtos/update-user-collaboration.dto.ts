import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

export class UpdateUserCollaborationDto {
  @ApiProperty({
    description: "Collaboration Request Status",
    type: String,
    example: "accept",
  })
  @IsString()
  @IsIn(["accept", "ignore"])
  status: string;
}
