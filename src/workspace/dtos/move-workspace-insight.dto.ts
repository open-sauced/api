import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class MoveWorkspaceInsightDto {
  @ApiProperty({
    description: "Insight Page ID",
    example: 237133,
    type: "integer",
  })
  @IsNumber()
  id: number;
}
