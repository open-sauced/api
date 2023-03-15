import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

import { PageOptionsDto } from "../../common/dtos/page-options.dto";
import { InsightFilterFieldsEnum } from "../../insight/dtos/insight-options.dto";

export enum PullRequestOrderFieldsEnum {
  created_at = "created_at",
  closed_at = "closed_at",
  merged_at = "merged_at",
  updated_at = "updated_at",
}

export enum PullRequestStatusEnum {
  open = "open",
  closed = "closed"
}

export class PullRequestPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: PullRequestOrderFieldsEnum,
    enumName: "PullRequestOrderFieldsEnum",
    default: PullRequestOrderFieldsEnum.updated_at,
  })
  @IsEnum(PullRequestOrderFieldsEnum)
  @IsOptional()
  readonly orderBy?: PullRequestOrderFieldsEnum = PullRequestOrderFieldsEnum.updated_at;

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

  @ApiPropertyOptional({
    enum: PullRequestStatusEnum,
    enumName: "PullRequestStatusEnum",
  })
  @IsEnum(PullRequestStatusEnum)
  @IsOptional()
  readonly status?: PullRequestStatusEnum;

  @ApiPropertyOptional({
    type: "string",
    example: "bdougie",
  })
  @IsString()
  @IsOptional()
  readonly contributor?: string;
}
