import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsString } from "class-validator";

import { RepoInfo } from "../../repo/dtos/repo-info.dto";

export class CreateInsightDto {
  @ApiProperty({
    description: "Insight Page Name",
    type: String,
    example: "My Team",
  })
  @IsString()
    name: string;

  @ApiProperty({
    description: "Insight Page Visibility",
    type: Boolean,
    example: false,
  })
  @IsBoolean()
    is_public: boolean;

  @ApiProperty({
    description: "An array of repository information objects",
    isArray: true,
    type: RepoInfo,
    example: [{ id: 797, full_name: "open-sauced/insights" }],
  })
  @Type(() => RepoInfo)
  @IsArray()
    repos: RepoInfo[];
}
