import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsOptional } from "class-validator";
import { DbRepoToUserVotes } from "../../repo/entities/repo.to.user.votes.entity";

export class UserRepoOptionsDto {
  @ApiProperty({
    description: "The repos to add to onboarding",
    type: "integer",
    isArray: true,
    example: [71359796, 426820139],
  })
  @IsArray()
  readonly ids: number[];
}

export class VotedRepoDto {
  @ApiProperty({
    description: "If the user has voted for the repo",
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  voted: boolean;

  @IsOptional()
  data: DbRepoToUserVotes | null;
}
