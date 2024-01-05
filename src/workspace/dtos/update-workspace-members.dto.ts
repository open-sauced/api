import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { WorkspaceMemberRoleEnum } from "../entities/workspace-member.entity";
import { NewMember } from "./create-workspace.dto";

export class UpdateWorkspaceMembersDto {
  @ApiProperty({
    description: "An array of member objects and their associated role",
    isArray: true,
    example: [{ id: 12345, role: "owner" }],
  })
  @IsArray()
  @Type(() => NewMember)
  members: { id: number; role: WorkspaceMemberRoleEnum }[];
}

export class UpdateWorkspaceMemberDto {
  @ApiPropertyOptional({
    enum: WorkspaceMemberRoleEnum,
    enumName: "WorkspaceMemberRoleEnum",
    default: WorkspaceMemberRoleEnum.Viewer,
  })
  @IsOptional()
  @IsEnum(WorkspaceMemberRoleEnum)
  role?: WorkspaceMemberRoleEnum = WorkspaceMemberRoleEnum.Viewer;
}
