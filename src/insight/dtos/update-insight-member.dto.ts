import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsIn } from "class-validator";

export class UpdateInsightMemberDto {

  @ApiPropertyOptional({
    description: "Insight Member Access",
    type: String,
    example: "view",
  })
  @IsString()
  @IsIn(["view", "edit", "admin", "pending"])
    access: string;
}
