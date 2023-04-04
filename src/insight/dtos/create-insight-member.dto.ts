import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateInsightMemberDto {
  @ApiProperty({
    description: "User ID",
    type: Number,
    example: 1337331,
  })
  @IsInt()
    user_id: number;

  @ApiProperty({
    description: "Insight Member Access",
    type: String,
    example: "view",
  })
  @IsString()
    access: string;
}
