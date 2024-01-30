import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional } from "class-validator";

export class WorkspaceStatsOptionsDto {
  @ApiPropertyOptional({
    description: "Range in days",
    default: 30,
    type: "integer",
  })
  @Type(() => Number)
  @IsIn([7, 30, 90])
  @IsInt()
  @IsOptional()
  readonly range?: number = 30;

  @ApiPropertyOptional({
    description: "Number of days in the past to start range block",
    default: 0,
    type: "integer",
  })
  @Type(() => Number)
  @IsIn([0, 7, 30, 90])
  @IsInt()
  @IsOptional()
  readonly prev_days_start_date?: number = 0;
}
