import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsNumber, IsOptional } from "class-validator";

export class TopProjectsDto {
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

  @ApiProperty({
    description: "Repo ID",
    type: "integer",
    example: 234343,
  })
  @Type(() => Number)
  @IsNumber()
  repo_id: number;
}
