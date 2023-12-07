import { ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PageOptionsDto } from "../../common/dtos/page-options.dto";
import { DbUserHighlightReaction } from "../../user/entities/user-highlight-reaction.entity";

export class HighlightOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: "Highlight Repo Filter",
    example: "open-sauced/insights",
  })
  @IsString()
  @IsOptional()
  readonly repo?: string;

  @ApiPropertyOptional({
    description: "Highlight User Filter",
    example: "RitaDee",
  })
  @IsString()
  @IsOptional()
  readonly contributor?: string;
}

export class DbUserHighlightReactionResponse extends PickType(DbUserHighlightReaction, ["emoji_id", "reaction_count"]) {
  @ApiPropertyOptional({
    description: "Usernames of users who reacted with this emoji",
    type: "string",
    example: ["RitaDee", "diivi"],
    isArray: true,
  })
  @IsString({ each: true })
  @IsOptional()
  readonly reaction_users?: string[];
}
