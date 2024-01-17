import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

import { PageOptionsDto } from "../../common/dtos/page-options.dto";
import { InsightFilterFieldsEnum } from "../../insight/dtos/insight-options.dto";

export class PullRequestContributorOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: InsightFilterFieldsEnum,
    enumName: "InsightFilterFieldsEnum",
  })
  @IsEnum(InsightFilterFieldsEnum)
  @IsOptional()
  readonly filter?: InsightFilterFieldsEnum;

  @ApiPropertyOptional({
    type: "string",
    example: "javascript",
  })
  @IsString()
  @IsOptional()
  readonly topic?: string;

  @ApiPropertyOptional({
    description: "A comma separated list of repos to filter on",
    type: "string",
    example: "open-sauced/app",
  })
  @IsString()
  @IsOptional()
  readonly repos?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly repoIds?: string;
}
