import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

import { PageOptionsDto } from "../../common/dtos/page-options.dto";

export enum InsightFilterFieldsEnum {
  Recent = "recent",
  Top100 = "top-100-repos",
  MinimumContributors = "minimum-5-contributors",
  MostActive = "most-active",
  MostSpammed = "most-spammed",
}

export class InsightOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: InsightFilterFieldsEnum,
    enumName: "InsightFilterFieldsEnum",
  })
  @IsEnum(InsightFilterFieldsEnum)
  @IsOptional()
  readonly filter?: InsightFilterFieldsEnum;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly repo?: string;

  @ApiPropertyOptional({
    type: "string",
    default: "javscript",
  })
  @IsString()
  @IsOptional()
  readonly topic?: string = "javscript";

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly repoIds?: string;
}
