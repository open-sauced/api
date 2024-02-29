import { IsEnum, IsOptional } from "class-validator";

import { ApiPropertyOptional } from "@nestjs/swagger";
import { PageOptionsDto } from "../../common/dtos/page-options.dto";

export enum ContributorStatsOrderEnum {
  commits = "commits",
  prs_created = "prs_created",
  total_contributions = "total_contributions",
}

export enum ContributorStatsTypeEnum {
  all = "all",
  active = "active",
  new = "new",
  alumni = "alumni",
}

export class MostActiveContributorsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: ContributorStatsTypeEnum,
    enumName: "ContributorStatsTypeEnum",
    default: ContributorStatsTypeEnum.all,
  })
  @IsEnum(ContributorStatsTypeEnum)
  @IsOptional()
  contributorType?: ContributorStatsTypeEnum = ContributorStatsTypeEnum.all;

  @ApiPropertyOptional({
    enum: ContributorStatsOrderEnum,
    enumName: "ContributorStatsOrderEnum",
    default: ContributorStatsOrderEnum.commits,
  })
  @IsEnum(ContributorStatsOrderEnum)
  @IsOptional()
  readonly orderBy?: ContributorStatsOrderEnum = ContributorStatsOrderEnum.commits;
}
