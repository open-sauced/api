import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString } from "class-validator";

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
    description: "Repo full name",
    type: String,
    example: "open-sauced/api",
  })
  @IsString()
  repo_name: string;
}
