import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Min, IsOptional, Max, IsString } from "class-validator";

export class FilterListContributorsDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 1000,
    default: 10,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly limit?: number = 10;

  @ApiPropertyOptional({
    type: "string",
    example: "Denver, Colorado",
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    type: "string",
    example: "bdougie",
  })
  @IsString()
  @IsOptional()
  contributor?: string;

  @ApiPropertyOptional({
    type: "string",
    example: "Mountain Standard Time",
  })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional({
    type: "integer",
    example: 2,
    description: "Less than or equal to the average number of days to merge a PR over the last 30 days",
  })
  @IsOptional()
  pr_velocity?: number;

  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 10);
  }
}
