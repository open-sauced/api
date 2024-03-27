import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { InsightFilterFieldsEnum } from "../../insight/dtos/insight-options.dto";
import { BaseHistogramDto } from "./base.dto";

export class PullRequestHistogramDto extends BaseHistogramDto {
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
}
