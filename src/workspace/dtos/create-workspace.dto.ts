import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsString } from "class-validator";
import { WorkspaceMemberRoleEnum } from "../entities/workspace-member.entity";

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
}
