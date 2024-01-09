import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { Type } from "class-transformer";
import { NewWorkspaceRepo } from "./update-workspace-repos.dto";

export class DeleteWorkspaceReposDto {
  @ApiProperty({
    description: "An array of repo objects to be added to the workspace",
    isArray: true,
    example: [{ full_name: "open-sauced/api" }],
  })
  @IsArray()
  @Type(() => NewWorkspaceRepo)
  repos: { full_name: string }[];
}
