import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";

export class InsightDto {
  @ApiPropertyOptional({
    description: "Include all data",
    example: "all",
  })
  @IsString()
  @IsOptional()
  @IsIn(["all", "none"])
  readonly include?: string = "all";
}
