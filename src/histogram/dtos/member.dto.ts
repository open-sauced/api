import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { BaseHistogramDto } from "./base.dto";

export class MemberHistogramDto extends BaseHistogramDto {
  @ApiPropertyOptional({
    description: "Org name",
    type: "string",
    example: "open-sauced",
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  org?: string;
}
