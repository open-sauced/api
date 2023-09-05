import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Min, IsOptional, Max } from "class-validator";

export class FilteredUsersDto {
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
    description: "Username search query to filter from the list of users",
    type: "string",
  })
  @IsOptional()
  @Type(() => String)
  readonly username?: string = "";

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
  readonly limit?: number = 50;

  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 50);
  }
}
