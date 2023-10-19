import { IsEnum, IsIn, IsInt, IsOptional } from "class-validator";

import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { UserListContributorStatsTypeEnum } from "./most-active-contributors.dto";

export class ContributionsTimeframeDto {
  @ApiPropertyOptional({
    description: "Range in days",
    default: 30,
    type: "integer",
  })
  @Type(() => Number)
  @IsIn([7, 30, 90])
  @IsInt()
  @IsOptional()
  readonly range?: number = 30;

  @ApiPropertyOptional({
    enum: UserListContributorStatsTypeEnum,
    enumName: "UserListContributorStatsTypeEnum",
    default: UserListContributorStatsTypeEnum.all,
  })
  @IsEnum(UserListContributorStatsTypeEnum)
  @IsOptional()
  contributorType?: UserListContributorStatsTypeEnum = UserListContributorStatsTypeEnum.all;
}
