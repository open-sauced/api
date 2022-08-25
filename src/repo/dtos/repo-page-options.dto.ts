import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import {PageOptionsDto} from "../../common/dtos/page-options.dto";

export enum RepoOrder {
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
    enum: RepoOrder,
    enumName: "RepoOrder",
    default: RepoOrder.stars
  })
  @IsEnum(RepoOrder)
  @IsOptional()
  readonly orderBy?: RepoOrder = RepoOrder.stars;
}
