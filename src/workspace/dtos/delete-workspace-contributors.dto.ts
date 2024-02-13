import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { Type } from "class-transformer";
import { NewWorkspaceContributor } from "./update-workspace-contributors.dto";

export class DeleteWorkspaceContributorsDto {
  @ApiProperty({
    description: "An array of contributor objects to delete from the workspace. Either id or login is required",
    isArray: true,
    example: [{ id: 12345, login: "jpmcb" }],
  })
  @IsArray()
  @Type(() => NewWorkspaceContributor)
  contributors: { id?: number; login?: string }[];
}
