import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { Type } from "class-transformer";
import { NewWorkspaceContributor } from "./update-workspace-contributors.dto";

export class DeleteWorkspaceContributorsDto {
  @ApiProperty({
    description: "An array of contributor objects to delete from the workspace",
    isArray: true,
    example: [{ id: 12345 }],
  })
  @IsArray()
  @Type(() => NewWorkspaceContributor)
  contributors: { id: number }[];
}
