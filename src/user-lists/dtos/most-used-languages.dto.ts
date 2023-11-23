import { IsEnum, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PageOptionsDto } from "../../common/dtos/page-options.dto";

export enum UserListContributorStatsTypeEnum {
  all = "all",
  active = "active",
  new = "new",
  alumni = "alumni",
}

export class UserListMostUsedLanguagesDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: UserListContributorStatsTypeEnum,
    enumName: "UserListContributorStatsTypeEnum",
    default: UserListContributorStatsTypeEnum.all,
  })
  @IsEnum(UserListContributorStatsTypeEnum)
  @IsOptional()
  contributorType?: UserListContributorStatsTypeEnum = UserListContributorStatsTypeEnum.all;
}
