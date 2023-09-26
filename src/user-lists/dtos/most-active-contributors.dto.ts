import { IsEnum, IsOptional } from "class-validator";

import { ApiPropertyOptional } from "@nestjs/swagger";
import { PageOptionsDto } from "../../common/dtos/page-options.dto";

export enum UserListContributorStatsOrderEnum {
  commits = "commits",
  prs_created = "prs_created",
}

export enum UserListContributorStatsTypeEnum {
  all = "all",
  active = "active",
  new = "new",
  alumni = "alumni",
}

export class UserListMostActiveContributorsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: UserListContributorStatsTypeEnum,
    enumName: "UserListContributorStatsTypeEnum",
    default: UserListContributorStatsTypeEnum.all,
  })
  @IsEnum(UserListContributorStatsTypeEnum)
  @IsOptional()
  contributorType?: UserListContributorStatsTypeEnum = UserListContributorStatsTypeEnum.all;

  @ApiPropertyOptional({
    enum: UserListContributorStatsOrderEnum,
    enumName: "UserListContributorStatsOrderEnum",
    default: UserListContributorStatsOrderEnum.commits,
  })
  @IsEnum(UserListContributorStatsOrderEnum)
  @IsOptional()
  readonly orderBy?: UserListContributorStatsOrderEnum = UserListContributorStatsOrderEnum.commits;
}
