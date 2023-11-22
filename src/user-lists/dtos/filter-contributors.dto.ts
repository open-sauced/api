import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsInt, Min, IsOptional, Max, IsString, IsArray } from "class-validator";

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
    isArray: true,
    type: "string",
    example: ["Denver, Colorado", "Germany"],
  })
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)) as string[], { toClassOnly: true })
  @IsOptional()
  location?: string[];

  @ApiPropertyOptional({
    type: "string",
    example: "bdougie",
  })
  @IsString()
  @IsOptional()
  contributor?: string;

  @ApiPropertyOptional({
    isArray: true,
    type: "string",
    example: ["Mountain Standard Time", "UTC"],
  })
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)) as string[], { toClassOnly: true })
  @IsOptional()
  timezone?: string[];

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
