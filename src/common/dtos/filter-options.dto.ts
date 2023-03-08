import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsEnum } from "class-validator";

import { InsightFilterFieldsEnum } from "../../insight/dtos/insight-options.dto";
import { PageOptionsDto } from "./page-options.dto";

export class FilterOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: InsightFilterFieldsEnum,
    enumName: "InsightFilterFieldsEnum",
  })
  @IsEnum(InsightFilterFieldsEnum)
  @IsOptional()
  readonly filter?: InsightFilterFieldsEnum;

  @ApiPropertyOptional({
    type: "string",
    default: "",
  })
  @IsString()
  @IsOptional()
  readonly topic?: string;

  @ApiPropertyOptional({
    type: "string",
    example: "open-sauced/insights",
  })
  @IsString()
  @IsOptional()
  readonly repo?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly repoIds?: string;
}
