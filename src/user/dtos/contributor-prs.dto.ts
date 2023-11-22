import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

import { PageOptionsDto } from "../../common/dtos/page-options.dto";

export enum RangeTypeEnum {
  All = "all",
  Recent = "recent",
}

export class ContributorPullRequestsDto extends PageOptionsDto {
  @ApiPropertyOptional({ enum: RangeTypeEnum, enumName: "OrderDirectionEnum", default: RangeTypeEnum.Recent })
  @IsEnum(RangeTypeEnum)
  @IsOptional()
  rangeType?: RangeTypeEnum = RangeTypeEnum.Recent;
}
