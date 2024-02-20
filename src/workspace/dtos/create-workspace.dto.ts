import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsString } from "class-validator";
import { WorkspaceMemberRoleEnum } from "../entities/workspace-member.entity";
import { NewWorkspaceRepo } from "./update-workspace-repos.dto";
import { NewWorkspaceContributor } from "./update-workspace-contributors.dto";

export class NewMember {
  id: number;
  login: string;
  role: WorkspaceMemberRoleEnum;
}

export class CreateWorkspaceDto {
  @ApiProperty({
    description: "Workspace name",
    type: String,
    example: "My Workspace",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Workspace description",
    type: String,
    example: "A workspace for my OSS collaborators",
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: "An array of new member objects",
    isArray: true,
    example: [{ id: 12345, role: "owner" }],
  })
  @IsArray()
  @Type(() => NewMember)
  members: { id: number; role: WorkspaceMemberRoleEnum }[];

  @ApiProperty({
    description: "An array of repo objects to be added to the workspace",
    isArray: true,
    example: [{ full_name: "open-sauced/api" }],
  })
  @IsArray()
  @Type(() => NewWorkspaceRepo)
  repos: { full_name: string }[];

  @ApiProperty({
    description: "An array of contributor objects to be added to the workspace",
    isArray: true,
    example: [{ id: 12345, login: "jpmcb" }],
  })
  @IsArray()
  @Type(() => NewWorkspaceContributor)
  contributors: { id?: number; login?: string }[];
}
