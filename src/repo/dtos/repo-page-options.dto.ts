import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

import { PageOptionsDto } from "../../common/dtos/page-options.dto";

export enum RepoFilterFieldsEnum {
  Recent = "recent",
  Top100 = "top-100-repos",
  MinimumContributors = "minimum-5-contributors",
  MostActive = "most-active",
  MostSpammed = "most-spammed",
}

export enum RepoOrderFieldsEnum {
  issues = "issues",
  stars = "stars",
  watchers = "watchers",
  subscribers = "subscribers",
  created_at = "created_at",
  updated_at = "updated_at",
  name = "name",
  contributionsCount = "contributionsCount",
  votesCount = "votesCount",
  submissionsCount = "submissionsCount",
  stargazersCount = "stargazersCount",
  starsCount = "starsCount",
}

export class RepoPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: RepoOrderFieldsEnum,
    enumName: "RepoOrderFieldsEnum",
    default: RepoOrderFieldsEnum.stars,
  })
  @IsEnum(RepoOrderFieldsEnum)
  @IsOptional()
  readonly orderBy?: RepoOrderFieldsEnum = RepoOrderFieldsEnum.stars;
}
