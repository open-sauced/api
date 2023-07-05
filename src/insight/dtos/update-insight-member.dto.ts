import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsIn } from "class-validator";

export class UpdateInsightMemberDto {
  @ApiProperty({
    description: "Insight Member Access",
    type: String,
    example: "view",
  })
  @IsString()
  @IsIn(["view", "edit", "admin", "pending"])
  access: string;
}
